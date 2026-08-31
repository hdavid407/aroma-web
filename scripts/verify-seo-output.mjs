import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const distDirectory = path.join(projectRoot, "dist");

const canonicalEntries = [
  ["/", "/", "index.html"],
  ["/menu/", "/menu/", "menu/index.html"],
  ["/events/", "/events/", "events/index.html"],
  ["/visit/", "/visit/", "visit/index.html"],
  ["/reservations/", "/reservations/", "reservations/index.html"],
  ["/faq/", "/faq/", "faq/index.html"],
  ["/group-dining/", "/group-dining/", "group-dining/index.html"],
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

const discoveredEntries = await discoverRouteEntries();
const dynamicEntries = discoveredEntries.filter(
  ([entryPath, renderPath]) =>
    entryPath === renderPath &&
    entryPath.startsWith("/events/") &&
    entryPath !== "/events/",
);
const canonicalRouteEntries = [...canonicalEntries, ...dynamicEntries];
const routeEntries = [...canonicalRouteEntries, ...aliasEntries];
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
  assertRouteContent(html, htmlPath, renderPath, basePath);

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
  assertStructuredData(
    html,
    htmlPath,
    renderPath,
    canonical,
    homeCanonical,
    basePath,
    dynamicEntries.some(([path]) => path === renderPath),
  );

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

await assertFallback(basePath);
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

function assertRouteContent(html, htmlPath, renderPath, basePath) {
  const h1Count = html.match(/<h1\b/gu)?.length ?? 0;

  assert(h1Count === 1, `${htmlPath} must contain exactly one H1`);

  const heroClass = renderPath === "/" ? "hero-image" : "page-hero-image";
  assert(html.includes(`class="${heroClass}"`), `${htmlPath} hero layer is missing`);

  const internalLinks = [...html.matchAll(/\bhref="(\/[^"#]*)"/gu)].map(
    ([, href]) => href,
  );
  const normalizedBasePath = basePath === "/" ? "/" : basePath.replace(/\/$/u, "");

  for (const href of internalLinks) {
    assert(
      normalizedBasePath === "/" || href === normalizedBasePath || href.startsWith(`${normalizedBasePath}/`),
      `${htmlPath} contains a root-relative link that ignores the ${basePath} base path: ${href}`,
    );
  }

  const requiredAnalytics = renderPath.startsWith("/events/") && renderPath !== "/events/"
    ? ["reserve-event-detail", "events-event-detail", "order-event-detail"]
    : {
    "/": ["reserve-hero", "menu-hero"],
    "/menu/": ["reserve-menu", "directions-menu", "order-menu"],
    "/events/": ["reserve-events", "contact-events", "event-detail"],
    "/visit/": ["directions-visit", "reserve-visit", "order-visit"],
    "/reservations/": ["reserve-reservations", "reservations-phone", "visit-reservations"],
    "/faq/": ["reserve-faq", "directions-faq", "contact-faq"],
    "/group-dining/": ["group-dining-phone", "group-dining-email", "group-dining-reserve"],
    "/catering/": ["catering-phone", "catering-email", "directions-catering"],
    "/story/": ["menu-story", "reserve-story"],
    "/contact/": ["directions-contact", "reserve-contact", "contact-phone"],
    "/gallery/": ["reserve-gallery", "menu-gallery"],
    "/gift-cards/": ["gift-card-phone", "gift-card-email", "reserve-gift-cards"],
    "/careers/": ["careers-email", "careers-phone", "menu-careers"],
    }[renderPath] ?? [];

  for (const analyticsId of requiredAnalytics) {
    assert(
      html.includes(`data-analytics="${analyticsId}"`),
      `${htmlPath} is missing analytics hook ${analyticsId}`,
    );
  }

  if (renderPath === "/events/") {
    const eventEndDates = [...html.matchAll(/data-event-end="([^"]+)"/gu)].map(
      ([, endDate]) => endDate,
    );
    const eventLinks = [...html.matchAll(/href="(\/events\/[^"#]+\/?)"/gu)].map(
      ([, href]) => href,
    );

    for (const endDate of eventEndDates) {
      assert(
        new Date(endDate).getTime() > Date.now(),
        `${htmlPath} renders an expired event ending ${endDate}`,
      );
    }

    for (const href of eventLinks) {
      assert(
        dynamicEntries.some(([entryPath]) => entryPath === href),
        `${htmlPath} links to an event detail page that was not generated: ${href}`,
      );
    }
  }
}

function assertStructuredData(
  html,
  htmlPath,
  renderPath,
  canonical,
  siteHome,
  basePath,
  isEventRoute,
) {
  const jsonText = extractSingle(
    html,
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gu,
    `${htmlPath} JSON-LD`,
  );
  const document = JSON.parse(jsonText);
  const graph = document["@graph"];

  assert(Array.isArray(graph), `${htmlPath} JSON-LD does not contain an @graph`);

  const restaurant = graph.find(
    (node) => node["@type"] === "Restaurant",
  );
  const webPage = graph.find((node) => node["@type"] === "WebPage");

  assert(restaurant, `${htmlPath} is missing the Restaurant node`);
  assert(
    restaurant["@id"] === `${siteHome}#restaurant`,
    `${htmlPath} Restaurant ID is not stable`,
  );
  assert(webPage?.url === canonical, `${htmlPath} WebPage URL does not match its canonical`);
  assert(restaurant.name === "Aroma Gastro Bar", `${htmlPath} restaurant name is unsupported`);
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
    "menu",
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

  assert(restaurant.menu === `${siteHome}menu/`, `${htmlPath} menu is incorrect`);
  assert(!("hasMenu" in restaurant), `${htmlPath} uses the deprecated hasMenu property`);
  assert(
    restaurant.potentialAction["@type"] === "ReserveAction",
    `${htmlPath} is missing ReserveAction`,
  );

  const serialized = JSON.stringify(document);

  assertNoReviewSchema(document, htmlPath);
  assertMenuSchema(document, html, htmlPath, renderPath, canonical);
  assertBreadcrumbSchema(document, html, htmlPath, renderPath, canonical, siteHome, basePath);
  assertEventSchema(document, html, htmlPath, canonical, isEventRoute);
  assertNoFaqSchema(document, htmlPath);
  assertSafeOutput(serialized, `${htmlPath} JSON-LD`);
}

function assertEventSchema(document, html, htmlPath, canonical, isEventRoute) {
  const eventNodes = collectTypedNodes(document, "Event");

  if (!isEventRoute) {
    assert(eventNodes.length === 0, `${htmlPath} contains Event schema`);
    return;
  }

  assert(eventNodes.length === 1, `${htmlPath} must contain one Event node`);
  const event = eventNodes[0];

  assert(event.url === canonical, `${htmlPath} Event URL does not match its canonical`);
  assert(typeof event.name === "string" && event.name.length > 0, `${htmlPath} Event is missing a name`);
  assert(typeof event.startDate === "string" && event.startDate.length > 0, `${htmlPath} Event is missing startDate`);
  assert(event.location?.address?.postalCode === "32807", `${htmlPath} Event location is unsupported`);
  assert(html.includes(escapeHtml(event.name)), `${htmlPath} Event name is not visible in route content`);
}

function assertNoFaqSchema(document, htmlPath) {
  assert(
    collectTypedNodes(document, "FAQPage").length === 0,
    `${htmlPath} contains FAQPage schema`,
  );
}

function assertBreadcrumbSchema(document, html, htmlPath, renderPath, canonical, siteHome, basePath) {
  const breadcrumbNodes = collectTypedNodes(document, "BreadcrumbList");
  const breadcrumbNavs = [
    ...html.matchAll(/<nav\b[^>]*aria-label="Breadcrumb"[^>]*>([\s\S]*?)<\/nav>/gu),
  ];

  if (renderPath === "/") {
    assert(breadcrumbNodes.length === 0, `${htmlPath} contains home BreadcrumbList schema`);
    assert(breadcrumbNavs.length === 0, `${htmlPath} contains home visible breadcrumbs`);
    return;
  }

  assert(breadcrumbNodes.length === 1, `${htmlPath} must contain one BreadcrumbList`);
  assert(breadcrumbNavs.length === 1, `${htmlPath} must contain one visible breadcrumb nav`);

  const breadcrumbNode = breadcrumbNodes[0];
  const visibleNav = breadcrumbNavs[0][1];
  const listHtml = extractSingle(
    visibleNav,
    /<ol\b[^>]*>([\s\S]*?)<\/ol>/gu,
    `${htmlPath} visible breadcrumbs`,
  );
  const visibleItems = [...listHtml.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gu)].map(
    (match) => {
      const content = match[1];
      const link = content.match(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/u);

      return {
        href: link?.[1],
        name: stripHtml(link?.[2] ?? content),
      };
    },
  );
  const schemaItems = breadcrumbNode.itemListElement;

  assert(breadcrumbNode["@id"] === `${canonical}#breadcrumb`, `${htmlPath} BreadcrumbList ID is incorrect`);
  assert(Array.isArray(schemaItems), `${htmlPath} BreadcrumbList has no items`);
  assert(
    schemaItems.length === visibleItems.length && visibleItems.length >= 2,
    `${htmlPath} breadcrumb item count is inconsistent`,
  );

  for (const [index, visibleItem] of visibleItems.entries()) {
    const schemaItem = schemaItems[index];

    assert(schemaItem["@type"] === "ListItem", `${htmlPath} contains an invalid breadcrumb item`);
    assert(schemaItem.position === index + 1, `${htmlPath} breadcrumb positions are inconsistent`);
    assert(schemaItem.name === visibleItem.name, `${htmlPath} breadcrumb names are inconsistent`);

    const expectedItemUrl = visibleItem.href
      ? siteUrlForVisibleHref(visibleItem.href, siteHome, basePath)
      : canonical;
    assert(schemaItem.item === expectedItemUrl, `${htmlPath} breadcrumb URLs are inconsistent`);

    const expectedVisibleHref =
      index === visibleItems.length - 1
        ? undefined
        : index === 0
          ? basePath
          : `${basePath}events/`;
    assert(visibleItem.href === expectedVisibleHref, `${htmlPath} visible breadcrumb link is inconsistent`);
  }

  assert(visibleItems[0].name === "Home", `${htmlPath} breadcrumbs must begin with Home`);
  assert(visibleItems[0].href === basePath, `${htmlPath} Home breadcrumb URL is incorrect`);
  assert(
    visibleItems.at(-1)?.href === undefined && schemaItems.at(-1)?.item === canonical,
    `${htmlPath} current breadcrumb is not canonical`,
  );
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
  const expectedLocations = canonicalRouteEntries.map(([, routePath]) =>
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

async function assertFallback(expectedBasePath) {
  const html = await readOutput("404.html");
  const expectedHomeHref = expectedBasePath;
  const expectedMenuHref = `${expectedBasePath}menu/`;
  const expectedContactHref = `${expectedBasePath}contact/`;

  assert(!/<link rel="canonical"/u.test(html), "404 must not contain a canonical URL");
  assert(
    html.includes(`href="${expectedHomeHref}">Home</a>`),
    `404 does not contain the direct ${expectedHomeHref} Home link`,
  );
  assert(
    html.includes(`href="${expectedMenuHref}">Menu</a>`),
    `404 does not contain the direct ${expectedMenuHref} Menu link`,
  );
  assert(
    html.includes(`href="${expectedContactHref}">Contact</a>`),
    `404 does not contain the direct ${expectedContactHref} Contact link`,
  );
  assert(html.includes('content="noindex, follow"'), "404 must remain noindex, follow");
  assert(html.includes("<title>Page Not Found | Aroma Gastro Bar</title>"), "404 title is not helpful");
  assert(!/<script\b/iu.test(html), "404 must not force a JavaScript redirect");
  assert(!html.includes("window.location"), "404 must not redirect with JavaScript");
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

function siteUrlForVisibleHref(href, siteHome, basePath) {
  if (href === basePath) {
    return siteHome;
  }

  const relativePath = href.startsWith(basePath)
    ? href.slice(basePath.length)
    : href.replace(/^\/+/, "");

  return `${siteHome}${relativePath}`;
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

function stripHtml(value) {
  return value
    .replace(/<[^>]*>/gu, "")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replace(/\s+/gu, " ")
    .trim();
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

async function discoverRouteEntries() {
  const files = await collectFiles(distDirectory);
  const htmlFiles = files.filter((filePath) => filePath.endsWith(".html"));
  const entries = [];

  for (const filePath of htmlFiles) {
    const html = await readFile(filePath, "utf8");
    const root = html.match(/<div\b(?=[^>]*\bid="root")(?<attributes>[^>]*)>/u);

    if (!root?.groups) {
      continue;
    }

    const entryPath = readAttribute(root.groups.attributes, "data-route-path");
    const renderPath = readAttribute(root.groups.attributes, "data-render-path");

    if (entryPath && renderPath) {
      entries.push([
        entryPath,
        renderPath,
        path.relative(distDirectory, filePath).replaceAll("\\", "/"),
      ]);
    }
  }

  return entries;
}
