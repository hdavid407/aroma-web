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

  await writeFile(htmlFile, html.replace(rootTag[0], renderedRoot));
}

await rm(ssrDirectory, { recursive: true, force: true });

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
