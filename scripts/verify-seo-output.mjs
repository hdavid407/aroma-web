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
const verificationTime = Date.now();
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
  assertSafeOutput(html, htmlPath);

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
  assertStructuredData(html, htmlPath, renderPath, canonical, homeCanonical);

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
await assertCrawlFiles(homeCanonical);
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

  const robots = extractSingle(
    html,
    /<meta name="robots" content="([^"]+)"/gu,
    `${htmlPath} robots directive`,
  );
  const ogImage = extractSingle(
    html,
    /<meta property="og:image" content="([^"]+)"/gu,
    `${htmlPath} Open Graph image`,
  );
  const twitterImage = extractSingle(
    html,
    /<meta name="twitter:image" content="([^"]+)"/gu,
    `${htmlPath} Twitter image`,
  );

  assert(!/\bnoindex\b/iu.test(robots), `${htmlPath} canonical output is noindex`);
  assert(twitterImage === ogImage, `${htmlPath} social images do not match`);
}

function assertStructuredData(html, htmlPath, renderPath, canonical, siteHome) {
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
  assert(restaurant.telephone === "+14072379661", `${htmlPath} telephone is unsupported`);
  assert(
    JSON.stringify(restaurant.servesCuisine) === JSON.stringify(["Dominican", "Latin fusion"]),
    `${htmlPath} cuisine data is unsupported`,
  );

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

  assertNoReviewSchema(document, htmlPath);
  assertMenuSchema(document, html, htmlPath, renderPath, canonical);
  assertEventSchema(document, html, htmlPath, renderPath, canonical, restaurant["@id"]);
  assertSafeOutput(serialized, `${htmlPath} JSON-LD`);
}

function assertMenuSchema(document, html, htmlPath, renderPath, canonical) {
  const menus = collectTypedNodes(document, "Menu");
  const menuSections = collectTypedNodes(document, "MenuSection");
  const menuItems = collectTypedNodes(document, "MenuItem");

  if (renderPath !== "/menu/") {
    assert(menus.length === 0, `${htmlPath} contains unsupported Menu schema`);
    assert(menuSections.length === 0, `${htmlPath} contains unsupported MenuSection schema`);
    assert(menuItems.length === 0, `${htmlPath} contains unsupported MenuItem schema`);
    return;
  }

  assert(menus.length === 1, `${htmlPath} must contain one Menu node`);
  assert(menus[0]["@id"] === `${canonical}#menu`, `${htmlPath} Menu ID is incorrect`);
  assert(Array.isArray(menus[0].hasMenuSection), `${htmlPath} Menu has no sections`);
  assert(menuSections.length === menus[0].hasMenuSection.length, `${htmlPath} MenuSection count is inconsistent`);

  for (const section of menus[0].hasMenuSection) {
    assert(section["@type"] === "MenuSection", `${htmlPath} contains an invalid MenuSection`);
    assert(typeof section.name === "string" && section.name.length > 0, `${htmlPath} MenuSection is missing a name`);
    assert(typeof section.description === "string" && section.description.length > 0, `${htmlPath} MenuSection is missing a description`);
    assert(Array.isArray(section.hasMenuItem) && section.hasMenuItem.length > 0, `${htmlPath} MenuSection has no items`);
    assert(html.includes(escapeHtml(section.name)), `${htmlPath} MenuSection is not visible in the route content`);

    for (const item of section.hasMenuItem) {
      assert(item["@type"] === "MenuItem", `${htmlPath} contains an invalid MenuItem`);
      assert(typeof item.name === "string" && item.name.length > 0, `${htmlPath} MenuItem is missing a name`);
      assert(html.includes(escapeHtml(item.name)), `${htmlPath} MenuItem is not visible in the route content`);
    }
  }

  assert(
    menuItems.length === menus[0].hasMenuSection.flatMap((section) => section.hasMenuItem).length,
    `${htmlPath} MenuItem count is inconsistent`,
  );
}

function assertEventSchema(document, html, htmlPath, renderPath, canonical, restaurantId) {
  const events = collectTypedNodes(document, "Event");

  if (renderPath !== "/events/") {
    assert(events.length === 0, `${htmlPath} contains unsupported Event schema`);
    return;
  }

  const visibleEvents = [...html.matchAll(/<article\b([^>]*)>/gu)]
    .map((match) => ({
      id: readAttribute(match[1], "data-event-id"),
      startDate: readAttribute(match[1], "data-event-start"),
      endDate: readAttribute(match[1], "data-event-end"),
    }))
    .filter((event) => event.id && event.startDate);

  assert(events.length === visibleEvents.length, `${htmlPath} Event schema does not match visible events`);

  for (const event of events) {
    const idPrefix = `${canonical}#event-`;
    const eventId = event["@id"]?.startsWith(idPrefix)
      ? event["@id"].slice(idPrefix.length)
      : undefined;
    const visibleEvent = visibleEvents.find((candidate) => candidate.id === eventId);

    assert(visibleEvent, `${htmlPath} contains unsupported Event ${event["@id"] ?? "without an ID"}`);
    assert(event.startDate === visibleEvent.startDate, `${htmlPath} Event startDate is unsupported`);
    assert(event.endDate === visibleEvent.endDate, `${htmlPath} Event endDate is unsupported`);
    assert(typeof event.name === "string" && html.includes(escapeHtml(event.name)), `${htmlPath} Event name is not visible`);
    assert(typeof event.description === "string" && html.includes(escapeHtml(event.description)), `${htmlPath} Event description is not visible`);
    assert(typeof event.url === "string" && event.url.length > 0, `${htmlPath} Event URL is missing`);
    assert(event.location?.["@id"] === restaurantId, `${htmlPath} Event location is unsupported`);

    const activeUntil = event.endDate ?? event.startDate;
    assert(
      Number.isFinite(new Date(activeUntil).getTime()) &&
        new Date(activeUntil).getTime() > verificationTime,
      `${htmlPath} contains an expired or invalid Event`,
    );
  }
}

function assertNoReviewSchema(document, htmlPath) {
  assert(
    collectTypedNodes(document, "Review").length === 0,
    `${htmlPath} contains Review schema`,
  );
  assert(
    collectTypedNodes(document, "AggregateRating").length === 0,
    `${htmlPath} contains AggregateRating schema`,
  );

  const serialized = JSON.stringify(document);

  assert(!serialized.includes('"aggregateRating"'), `${htmlPath} contains aggregateRating`);
  assert(!serialized.includes('"review"'), `${htmlPath} contains review schema`);
}

function collectTypedNodes(value, type) {
  if (Array.isArray(value)) {
    return value.flatMap((item) => collectTypedNodes(item, type));
  }

  if (!value || typeof value !== "object") {
    return [];
  }

  const nodeTypes = Array.isArray(value["@type"])
    ? value["@type"]
    : [value["@type"]];
  const matches = nodeTypes.includes(type) ? [value] : [];

  return [
    ...matches,
    ...Object.values(value).flatMap((item) => collectTypedNodes(item, type)),
  ];
}

async function assertCrawlFiles(siteHome) {
  const sitemap = await readOutput("sitemap.xml");
  const robots = await readOutput("robots.txt");
  const sitemapLocations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/gu)].map(
    (match) => match[1],
  );
  const expectedLocations = canonicalEntries.map(([, routePath]) =>
    `${siteHome}${routePath === "/" ? "" : routePath.slice(1)}`,
  );

  assertSafeOutput(sitemap, "sitemap.xml");
  assertSafeOutput(robots, "robots.txt");
  assert(sitemap.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'), "sitemap.xml has an invalid root");
  assert(!/<(?:priority|changefreq)>/u.test(sitemap), "sitemap.xml contains priority or changefreq");
  assert(
    JSON.stringify([...sitemapLocations].sort()) ===
      JSON.stringify([...expectedLocations].sort()),
    "sitemap.xml membership does not exactly match canonical routes",
  );

  for (const [aliasPath] of aliasEntries) {
    const aliasUrl = `${siteHome}${aliasPath.slice(1)}`;
    assert(!sitemapLocations.includes(aliasUrl), `sitemap.xml contains alias ${aliasUrl}`);
  }

  const expectedAllowPath = new URL(siteHome).pathname;
  const sitemapDirective = extractSingle(
    robots,
    /^Sitemap:\s*(\S+)$/gmu,
    "robots.txt Sitemap directive",
  );
  const allowDirective = extractSingle(
    robots,
    /^Allow:\s*(\S+)$/gmu,
    "robots.txt Allow directive",
  );

  assert(sitemapDirective === `${siteHome}sitemap.xml`, "robots.txt Sitemap URL is incorrect");
  assert(allowDirective === expectedAllowPath, "robots.txt Allow path is incorrect");
}

function assertSafeOutput(value, label) {
  assert(
    !/https?:\/\/(?:[^/\s"']+\.)?owner\.com(?:[/\s"']|$)/iu.test(value),
    `${label} contains an Owner.com URL`,
  );
  assert(
    !/(?:__[^\s"'<]*TOAST[^\s"'<]*__|\b(?:TOAST_URL|TOAST_LINK|TOAST_DESTINATION)\b|https?:\/\/(?:www\.)?toasttab\.com\/[^\s"'<]*(?:placeholder|example|your[-_]|replace[-_]|todo)[^\s"'<]*)/iu.test(value),
    `${label} contains a placeholder Toast URL`,
  );
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

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
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
