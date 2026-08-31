import {
  businessProfile,
  getRouteBreadcrumbs,
  routeById,
  isEventUpcoming,
  type HoursEntry,
  type EventRecord,
  type RouteDefinition,
} from "./siteContent";

export const DEFAULT_SITE_ORIGIN = "https://hdavid407.github.io/aroma-web";

export type SeoContext = {
  siteOrigin: string;
  basePath: string;
  canonicalPath?: string;
};

const trimTrailingSlashes = (value: string) => value.replace(/\/+$/u, "");

const normalizeBasePath = (basePath: string) => {
  const withLeadingSlash = basePath.startsWith("/") ? basePath : `/${basePath}`;

  return withLeadingSlash === "/"
    ? "/"
    : `/${withLeadingSlash.replace(/^\/+|\/+$/gu, "")}/`;
};

const siteRootUrl = (siteOrigin: string, basePath: string) => {
  const normalizedOrigin = trimTrailingSlashes(siteOrigin.trim());
  const normalizedBase = normalizeBasePath(basePath);

  if (normalizedBase === "/") {
    return normalizedOrigin;
  }

  const baseWithoutTrailingSlash = normalizedBase.slice(0, -1);
  const originPath = normalizedOrigin
    .replace(/^[a-z][a-z\d+.-]*:\/\/[^/]+/iu, "")
    .replace(/\/+$/u, "");

  return originPath.endsWith(baseWithoutTrailingSlash)
    ? normalizedOrigin
    : `${normalizedOrigin}${baseWithoutTrailingSlash}`;
};

export const buildSiteUrl = (
  siteOrigin: string,
  basePath: string,
  routePath: string,
) => {
  const rootUrl = siteRootUrl(siteOrigin, basePath);
  const relativePath = routePath === "/" ? "/" : `/${routePath.replace(/^\/+|\/+$/gu, "")}/`;

  return `${rootUrl}${relativePath}`;
};

export const buildAssetUrl = (
  siteOrigin: string,
  basePath: string,
  assetPath: string,
) =>
  `${siteRootUrl(siteOrigin, basePath)}/assets/${assetPath.replace(/^\/+/, "")}`;

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const toTwentyFourHourTime = (
  hour: string,
  minute: string | undefined,
  meridiem: string,
) => {
  const parsedHour = Number(hour) % 12;
  const adjustedHour = meridiem === "PM" ? parsedHour + 12 : parsedHour;

  return `${String(adjustedHour).padStart(2, "0")}:${minute ?? "00"}`;
};

const openingHoursSpecification = (hours: HoursEntry[]) =>
  hours.flatMap((entry) => {
    const range = entry.hours.match(
      /^(\d{1,2})(?::(\d{2}))? (AM|PM) to (\d{1,2})(?::(\d{2}))? (AM|PM)$/u,
    );

    if (!range) {
      return [];
    }

    return [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${entry.days}`,
        opens: toTwentyFourHourTime(range[1], range[2], range[3]),
        closes: toTwentyFourHourTime(range[4], range[5], range[6]),
      },
    ];
  });

const menuGraphNodes = (route: RouteDefinition, canonicalUrl: string) => {
  if (!route.content.menuSections?.length) {
    return [];
  }

  const menuId = `${canonicalUrl}#menu`;

  return [
    {
      "@type": "Menu",
      "@id": menuId,
      name: `${businessProfile.name} menu`,
      url: canonicalUrl,
      hasMenuSection: route.content.menuSections.map((section) => ({
        "@type": "MenuSection",
        "@id": `${menuId}#${section.id}`,
        name: section.title,
        description: section.summary,
        hasMenuItem: section.items.map((item) => ({
          "@type": "MenuItem",
          name: item.name,
          ...(item.description ? { description: item.description } : {}),
          ...(item.price
            ? {
                offers: {
                  "@type": "Offer",
                  price: item.price,
                  priceCurrency: "USD",
                },
              }
            : {}),
        })),
      })),
    },
  ];
};

const breadcrumbGraphNode = (
  route: RouteDefinition,
  canonicalUrl: string,
  siteOrigin: string,
  basePath: string,
) => ({
  "@type": "BreadcrumbList",
  "@id": `${canonicalUrl}#breadcrumb`,
  itemListElement: getRouteBreadcrumbs(route).map((breadcrumb, index, breadcrumbs) => ({
    "@type": "ListItem",
    position: index + 1,
    name: breadcrumb.name,
    item:
      index === breadcrumbs.length - 1
        ? canonicalUrl
        : buildSiteUrl(siteOrigin, basePath, breadcrumb.path),
  })),
});

const eventGraphNode = (
  event: EventRecord,
  canonicalUrl: string,
  imageUrl: string,
  restaurantId: string,
) => ({
  "@type": "Event",
  "@id": `${canonicalUrl}#event`,
  name: event.title,
  startDate: event.startIso,
  ...(event.endIso ? { endDate: event.endIso } : {}),
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  image: [imageUrl],
  url: canonicalUrl,
  location: {
    "@type": "Place",
    name: businessProfile.name,
    address: {
      "@type": "PostalAddress",
      ...businessProfile.address,
    },
  },
  organizer: {
    "@id": restaurantId,
    "@type": "Restaurant",
    name: businessProfile.name,
  },
});

const buildJsonLdGraph = (
  route: RouteDefinition,
  canonicalUrl: string,
  siteOrigin: string,
  basePath: string,
  imageUrl: string,
) => {
  const homeUrl = buildSiteUrl(siteOrigin, basePath, routeById.home.path);
  const restaurantId = `${homeUrl}#restaurant`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Restaurant",
        "@id": restaurantId,
        name: businessProfile.name,
        url: homeUrl,
        logo: buildAssetUrl(siteOrigin, basePath, "aroma-logo.png"),
        image: buildAssetUrl(
          siteOrigin,
          basePath,
          routeById.home.meta.heroImage,
        ),
        address: {
          "@type": "PostalAddress",
          ...businessProfile.address,
        },
        telephone: businessProfile.phoneHref.replace("tel:", ""),
        openingHoursSpecification: openingHoursSpecification(
          businessProfile.hours,
        ),
        servesCuisine: businessProfile.cuisines,
        hasMap: businessProfile.directionsUrl,
        sameAs: businessProfile.socialLinks.map((link) => link.href),
        menu: buildSiteUrl(siteOrigin, basePath, routeById.menu.path),
        potentialAction: {
          "@type": "ReserveAction",
          target: businessProfile.reservationUrl,
        },
      },
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: route.meta.title,
        description: route.meta.description,
        primaryImageOfPage: imageUrl,
        about: { "@id": restaurantId },
      },
      ...(route.id === "home"
        ? []
        : [breadcrumbGraphNode(route, canonicalUrl, siteOrigin, basePath)]),
      ...(route.event && isEventUpcoming(route.event)
        ? [eventGraphNode(route.event, canonicalUrl, imageUrl, restaurantId)]
        : []),
      ...menuGraphNodes(route, canonicalUrl),
    ],
  };
};

export const buildRouteHeadHtml = (
  route: RouteDefinition,
  context: SeoContext,
) => {
  const canonicalUrl = buildSiteUrl(
    context.siteOrigin,
    context.basePath,
    context.canonicalPath ?? route.path,
  );
  const imageUrl = buildAssetUrl(
    context.siteOrigin,
    context.basePath,
    route.meta.heroImage,
  );
  const jsonLd = JSON.stringify(
    buildJsonLdGraph(
      route,
      canonicalUrl,
      context.siteOrigin,
      context.basePath,
      imageUrl,
    ),
  ).replaceAll("<", "\\u003c");

  return [
    `<title>${escapeHtml(route.meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(route.meta.description)}" />`,
    '<meta name="robots" content="index, follow, max-image-preview:large" />',
    '<meta name="theme-color" content="#080a08" />',
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`,
    '<meta property="og:type" content="restaurant" />',
    '<meta property="og:locale" content="en_US" />',
    `<meta property="og:title" content="${escapeHtml(route.meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(route.meta.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`,
    `<meta property="og:site_name" content="${escapeHtml(businessProfile.name)}" />`,
    `<meta property="og:image" content="${escapeHtml(imageUrl)}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(route.meta.heroAlt)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapeHtml(route.meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(route.meta.description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(imageUrl)}" />`,
    `<meta name="twitter:image:alt" content="${escapeHtml(route.meta.heroAlt)}" />`,
    `<script type="application/ld+json">${jsonLd}</script>`,
  ].join("\n    ");
};
