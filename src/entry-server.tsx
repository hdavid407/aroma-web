import { renderToString } from "react-dom/server";
import App from "./App";
import { buildRouteHeadHtml, DEFAULT_SITE_ORIGIN } from "./seo";
import { eventRoutes, resolveRoute } from "./siteContent";

export { DEFAULT_SITE_ORIGIN } from "./seo";

export function renderRoute(renderPath: string, basePath: string) {
  return renderToString(<App routePath={renderPath} basePath={basePath} />);
}

export function renderRouteHead(
  renderPath: string,
  basePath: string,
  siteOrigin = DEFAULT_SITE_ORIGIN,
) {
  return buildRouteHeadHtml(resolveRoute(renderPath, basePath), {
    siteOrigin,
    basePath,
    canonicalPath: renderPath,
  });
}

export function getDynamicRoutePaths() {
  return eventRoutes.map((route) => route.path);
}
