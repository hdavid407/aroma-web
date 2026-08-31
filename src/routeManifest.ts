import {
  allRoutes,
  canonicalRoutes,
  routeById,
  type RouteDefinition,
  type RouteId,
} from "./siteContent";

export const legacyRouteAliases = {
  "/page/menu/": "/menu/",
  "/page/gallery/": "/gallery/",
  "/page/contact/": "/contact/",
  "/rsvp/": "/contact/",
  "/happyhour/": "/menu/",
} as const satisfies Record<`/${string}/`, RouteDefinition["path"]>;

export type LegacyRoutePath = keyof typeof legacyRouteAliases;

export type RouteEntry = {
  entryPath: string;
  renderPath: RouteDefinition["path"];
  canonicalPath: RouteDefinition["path"];
  routeId: RouteId;
  htmlPath: string;
  isAlias: boolean;
};

export const routeHtmlPath = (routePath: string) =>
  routePath === "/" ? "index.html" : `${routePath.slice(1)}index.html`;

const routeByPath = new Map(
  allRoutes.map((route) => [route.path, route] as const),
);

const createRouteEntry = (
  entryPath: string,
  renderPath: RouteDefinition["path"],
  isAlias: boolean,
): RouteEntry => {
  const route = routeByPath.get(renderPath);

  if (!route) {
    throw new Error(`Unknown canonical render path: ${renderPath}`);
  }

  return {
    entryPath,
    renderPath: route.path,
    canonicalPath: route.path,
    routeId: route.id,
    htmlPath: routeHtmlPath(entryPath),
    isAlias,
  };
};

const canonicalEntries = allRoutes.map((route) =>
  createRouteEntry(route.path, route.path, false),
);

const staticCanonicalEntries = canonicalRoutes.map((route) =>
  createRouteEntry(route.path, route.path, false),
);

const aliasEntries = Object.entries(legacyRouteAliases).map(
  ([entryPath, renderPath]) => createRouteEntry(entryPath, renderPath, true),
);

export const routeEntries: RouteEntry[] = [
  ...canonicalEntries,
  ...aliasEntries,
];

export const routeHtmlInputs = [...staticCanonicalEntries, ...aliasEntries].map(
  (entry) => entry.htmlPath,
);

const routeEntryByHtmlPath = new Map(
  routeEntries.map((entry) => [entry.htmlPath, entry] as const),
);

export const findRouteEntryByHtmlPath = (htmlPath: string) =>
  routeEntryByHtmlPath.get(htmlPath.replaceAll("\\", "/"));

export const routeDefinitionForEntry = (entry: RouteEntry) =>
  routeByPath.get(entry.renderPath) ?? routeById[entry.routeId];
