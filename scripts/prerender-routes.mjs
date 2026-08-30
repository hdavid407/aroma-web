import { readFile, readdir, rm, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import path from "node:path";

const projectRoot = process.cwd();
const distDirectory = path.join(projectRoot, "dist");
const ssrDirectory = path.join(distDirectory, ".ssr");
const basePath = readBasePath(process.argv.slice(2));

const ssrEntryPath = await findSsrEntry(ssrDirectory);
const ssrModule = await import(pathToFileURL(ssrEntryPath).href);

if (typeof ssrModule.renderRoute !== "function") {
  throw new TypeError(`SSR entry does not export renderRoute(): ${ssrEntryPath}`);
}

const htmlFiles = await collectFiles(distDirectory, (filePath) =>
  filePath.endsWith(".html"),
);
const renderedRoutes = [];

for (const htmlFile of htmlFiles) {
  const html = await readFile(htmlFile, "utf8");
  const rootTag = html.match(/<div\b(?=[^>]*\bid="root")(?<attributes>[^>]*)><\/div>/u);

  if (!rootTag?.groups) {
    continue;
  }

  const entryPath = readAttribute(rootTag.groups.attributes, "data-route-path");
  const renderPath = readAttribute(
    rootTag.groups.attributes,
    "data-render-path",
  );

  if (!entryPath || !renderPath) {
    throw new Error(`Route data attributes are missing from ${htmlFile}`);
  }

  const markup = ssrModule.renderRoute(renderPath, basePath);
  const renderedRoot = rootTag[0].replace("></div>", `>${markup}</div>`);
  const renderedHtml = html.replace(rootTag[0], renderedRoot);

  await writeFile(htmlFile, renderedHtml);
  renderedRoutes.push({ entryPath, renderPath, html: renderedHtml });
}

await writeCrawlFiles(renderedRoutes);

await rm(ssrDirectory, { recursive: true, force: true });

async function writeCrawlFiles(routes) {
  const canonicalRoutes = routes
    .filter(({ entryPath, renderPath }) => entryPath === renderPath)
    .sort((left, right) => left.entryPath.localeCompare(right.entryPath));
  const canonicalUrls = canonicalRoutes.map(({ html }) => {
    const match = html.match(/<link rel="canonical" href="([^"]+)"/u);

    if (!match?.[1]) {
      throw new Error("Unable to find a canonical URL while generating sitemap.xml");
    }

    return match[1];
  });

  if (!canonicalUrls.length) {
    throw new Error("Unable to generate sitemap.xml without canonical routes");
  }

  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...canonicalUrls.map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`),
    "</urlset>",
    "",
  ].join("\n");
  const homeRoute = routes.find(({ entryPath }) => entryPath === "/");
  const siteHome = homeRoute?.html.match(/<link rel="canonical" href="([^"]+)"/u)?.[1];

  if (!siteHome) {
    throw new Error("Unable to determine the site home URL for robots.txt");
  }

  const sitemapUrl = new URL("sitemap.xml", siteHome).href;
  const allowPath = new URL(siteHome).pathname;
  const robots = [
    "User-agent: *",
    `Allow: ${allowPath}`,
    "",
    `Sitemap: ${sitemapUrl}`,
    "",
  ].join("\n");

  await writeFile(path.join(distDirectory, "sitemap.xml"), sitemap);
  await writeFile(path.join(distDirectory, "robots.txt"), robots);
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function readBasePath(args) {
  const baseArgument = args.find((argument) => argument.startsWith("--base="));
  const rawBase = baseArgument?.slice("--base=".length) || "/";
  const normalized = rawBase.startsWith("/") ? rawBase : `/${rawBase}`;

  return normalized === "/" ? "/" : `${normalized.replace(/\/+$/u, "")}/`;
}

function readAttribute(attributes, attributeName) {
  const match = attributes.match(
    new RegExp(`\\b${attributeName}="([^"]+)"`, "u"),
  );

  return match?.[1];
}

async function findSsrEntry(directoryPath) {
  const candidates = await collectFiles(
    directoryPath,
    (filePath) => /\.(?:mjs|js)$/u.test(filePath),
  );
  const namedEntry = candidates.find((filePath) =>
    /(?:^|[/\\])entry-server(?:[-.][^/\\]+)?\.(?:mjs|js)$/u.test(filePath),
  );

  if (namedEntry) {
    return namedEntry;
  }

  if (candidates.length === 1) {
    return candidates[0];
  }

  throw new Error(`Unable to locate the SSR entry in ${directoryPath}`);
}

async function collectFiles(directoryPath, predicate) {
  const entries = await readdir(directoryPath, { withFileTypes: true });
  const collected = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directoryPath, entry.name);

      if (entry.isDirectory()) {
        return collectFiles(entryPath, predicate);
      }

      return entry.isFile() && predicate(entryPath) ? [entryPath] : [];
    }),
  );

  return collected.flat();
}
