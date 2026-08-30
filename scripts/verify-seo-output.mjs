import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const distDirectory = path.join(projectRoot, "dist");

const canonicalEntries = [
  ["/", "/", "index.html"],
  ["/menu/", "/menu/", "menu/index.html"],
  ["/events/", "/events/", "events/index.html"],
  ["/catering/", "/catering/", "catering/index.html"],
  ["/story/", "/story/", "story/index.html"],
  ["/contact/", "/contact/", "contact/index.html"],
  ["/gallery/", "/gallery/", "gallery/index.html"],
  ["/gift-cards/", "/gift-cards/", "gift-cards/index.html"],
  ["/careers/", "/careers/", "careers/index.html"],
];

const aliasEntries = [
  ["/page/menu/", "/menu/", "page/menu/index.html"],
  ["/page/gallery/", "/gallery/", "page/gallery/index.html"],
  ["/page/contact/", "/contact/", "page/contact/index.html"],
  ["/rsvp/", "/contact/", "rsvp/index.html"],
  ["/happyhour/", "/menu/", "happyhour/index.html"],
];

const routeEntries = [...canonicalEntries, ...aliasEntries];
const homeHtml = await readOutput("index.html");
const homeCanonical = extractSingle(
  homeHtml,
  /<link rel="canonical" href="([^"]+)"/gu,
  "home canonical",
);
const clientScript = extractSingle(
  homeHtml,
  /<script type="module"[^>]* src="([^"]+)"/gu,
  "client script",
);
const assetsIndex = clientScript.indexOf("assets/");

assert(assetsIndex >= 0, `Client script is not emitted under assets/: ${clientScript}`);

const basePath = clientScript.slice(0, assetsIndex);
const canonicalMetadata = new Map();

for (const [entryPath, renderPath, htmlPath] of routeEntries) {
  const html = await readOutput(htmlPath);

  assert(!html.includes("route-head"), `${htmlPath} retains the route-head marker`);
  assert(!html.includes("__AROMA_"), `${htmlPath} retains a build placeholder`);

  const root = html.match(/<div\b(?=[^>]*\bid="root")(?<attributes>[^>]*)>/u);

  assert(root?.groups, `${htmlPath} is missing the route root`);
  assert(
    readAttribute(root.groups.attributes, "data-route-path") === entryPath,
    `${htmlPath} has the wrong data-route-path`,
  );
  assert(
    readAttribute(root.groups.attributes, "data-render-path") === renderPath,
    `${htmlPath} has the wrong data-render-path`,
  );
  assert(
    html.slice(root.index + root[0].length).includes("<main"),
    `${htmlPath} does not contain prerendered App markup`,
  );

  const title = extractSingle(html, /<title>([^<]+)<\/title>/gu, `${htmlPath} title`);
  const description = extractSingle(
    html,
    /<meta name="description" content="([^"]+)"/gu,
    `${htmlPath} description`,
  );
  const canonical = extractSingle(
    html,
    /<link rel="canonical" href="([^"]+)"/gu,
    `${htmlPath} canonical`,
  );
  const expectedCanonical = `${homeCanonical}${renderPath === "/" ? "" : renderPath.slice(1)}`;

  assert(canonical === expectedCanonical, `${htmlPath} canonical is ${canonical}`);
  assertMetadata(html, htmlPath, title, description, canonical);
  assertStructuredData(html, htmlPath, canonical, homeCanonical);

  const metadata = { title, description, canonical };

  if (entryPath === renderPath) {
    canonicalMetadata.set(renderPath, metadata);
  } else {
    const destination = canonicalMetadata.get(renderPath);

    assert(destination, `Alias ${entryPath} was checked before ${renderPath}`);
    assert(
      title === destination.title && description === destination.description,
      `${htmlPath} does not use destination metadata`,
    );
  }
}

assertUnique(
  [...canonicalMetadata.values()].map(({ title }) => title),
  "canonical titles",
);
assertUnique(
  [...canonicalMetadata.values()].map(({ description }) => description),
  "canonical descriptions",
);

await assertFallback(basePath, `${homeCanonical}menu/`);
await assertHtmlFileCount(routeEntries.length + 1);
await assertSsrBundleRemoved();

console.log(
  `SEO verification passed for ${routeEntries.length} prerendered routes and the base-aware fallback (${basePath}).`,
);

function assertMetadata(html, htmlPath, title, description, canonical) {
  const expected = [
    [/<meta property="og:type" content="restaurant"/gu, "Open Graph type"],
    [new RegExp(`<meta property="og:title" content="${escapeRegExp(title)}"`, "gu"), "Open Graph title"],
    [new RegExp(`<meta property="og:description" content="${escapeRegExp(description)}"`, "gu"), "Open Graph description"],
    [new RegExp(`<meta property="og:url" content="${escapeRegExp(canonical)}"`, "gu"), "Open Graph URL"],
    [/<meta property="og:image" content="[^"]+"/gu, "Open Graph image"],
    [/<meta name="twitter:card" content="summary_large_image"/gu, "Twitter card"],
    [/<meta name="twitter:title" content="[^"]+"/gu, "Twitter title"],
    [/<meta name="twitter:description" content="[^"]+"/gu, "Twitter description"],
    [/<meta name="twitter:image" content="[^"]+"/gu, "Twitter image"],
  ];

  for (const [pattern, label] of expected) {
    extractSingle(html, pattern, `${htmlPath} ${label}`);
  }
}

function assertStructuredData(html, htmlPath, canonical, siteHome) {
  const jsonText = extractSingle(
    html,
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gu,
    `${htmlPath} JSON-LD`,
  );
  const document = JSON.parse(jsonText);
  const graph = document["@graph"];

  assert(Array.isArray(graph), `${htmlPath} JSON-LD does not contain an @graph`);

  const restaurant = graph.find(
    (node) =>
      Array.isArray(node["@type"]) &&
      node["@type"].includes("Restaurant") &&
      node["@type"].includes("LocalBusiness"),
  );
  const webPage = graph.find((node) => node["@type"] === "WebPage");

  assert(restaurant, `${htmlPath} is missing the Restaurant/LocalBusiness node`);
  assert(webPage?.url === canonical, `${htmlPath} WebPage URL does not match its canonical`);

  for (const field of [
    "name",
    "url",
    "logo",
    "image",
    "address",
    "telephone",
    "openingHoursSpecification",
    "servesCuisine",
    "hasMap",
    "sameAs",
    "hasMenu",
    "potentialAction",
  ]) {
    assert(restaurant[field], `${htmlPath} Restaurant node is missing ${field}`);
  }

  for (const field of [
    "streetAddress",
    "addressLocality",
    "addressRegion",
    "postalCode",
    "addressCountry",
  ]) {
    assert(restaurant.address[field], `${htmlPath} address is missing ${field}`);
  }

  assert(restaurant.hasMenu === `${siteHome}menu/`, `${htmlPath} hasMenu is incorrect`);
  assert(
    restaurant.potentialAction["@type"] === "ReserveAction",
    `${htmlPath} is missing ReserveAction`,
  );

  const serialized = JSON.stringify(document);

  assert(!serialized.includes("aggregateRating"), `${htmlPath} contains aggregateRating`);
  assert(!serialized.includes('"review"'), `${htmlPath} contains review schema`);
}

async function assertFallback(expectedBasePath, expectedCanonical) {
  const html = await readOutput("404.html");
  const canonical = extractSingle(
    html,
    /<link rel="canonical" href="([^"]+)"/gu,
    "404 canonical",
  );
  const expectedMenuHref = `${expectedBasePath}menu/`;

  assert(canonical === expectedCanonical, `404 canonical is ${canonical}`);
  assert(
    html.includes(`href="${expectedMenuHref}">View the Menu</a>`),
    `404 does not contain the direct ${expectedMenuHref} link`,
  );
  assert(html.includes('content="noindex, follow"'), "404 must remain noindex, follow");
  assert(html.includes('startsWith("/tags/")'), "404 script does not handle /tags/*");
  assert(html.includes('startsWith("/places/")'), "404 script does not handle /places/*");
  assert(html.includes('targetRoute = isLegacyTaxonomy ? "/menu/" : "/"'), "404 destinations are not deterministic");
  assert(!html.includes("__AROMA_"), "404 retains a build placeholder");
}

async function assertHtmlFileCount(expectedCount) {
  const files = await collectFiles(distDirectory);
  const htmlFiles = files.filter((filePath) => filePath.endsWith(".html"));

  assert(
    htmlFiles.length === expectedCount,
    `Expected ${expectedCount} HTML files, found ${htmlFiles.length}`,
  );
}

async function assertSsrBundleRemoved() {
  try {
    await stat(path.join(distDirectory, ".ssr"));
  } catch (error) {
    if (error?.code === "ENOENT") {
      return;
    }

    throw error;
  }

  throw new Error("dist/.ssr remains after prerendering");
}

async function readOutput(relativePath) {
  return readFile(path.join(distDirectory, relativePath), "utf8");
}

function extractSingle(value, pattern, label) {
  const matches = [...value.matchAll(pattern)];

  assert(matches.length === 1, `${label}: expected one match, found ${matches.length}`);

  return matches[0][1] ?? matches[0][0];
}

function readAttribute(attributes, attributeName) {
  return attributes.match(new RegExp(`\\b${attributeName}="([^"]+)"`, "u"))?.[1];
}

function assertUnique(values, label) {
  assert(new Set(values).size === values.length, `${label} are not unique`);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

async function collectFiles(directoryPath) {
  const entries = await readdir(directoryPath, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directoryPath, entry.name);

      return entry.isDirectory() ? collectFiles(entryPath) : [entryPath];
    }),
  );

  return nested.flat();
}
