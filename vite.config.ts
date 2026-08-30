import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Plugin, type ResolvedConfig } from "vite";
import {
  findRouteEntryByHtmlPath,
  routeDefinitionForEntry,
  routeHtmlInputs,
} from "./src/routeManifest";
import { buildRouteHeadHtml, DEFAULT_SITE_ORIGIN } from "./src/seo";

const ROUTE_HEAD_MARKER = '<meta name="route-head" content="pending" />';
const FALLBACK_SCRIPT_MARKER = "__AROMA_FALLBACK_SCRIPT__";

const normalizeBasePath = (basePath: string) =>
  basePath === "/" ? "/" : `${basePath.replace(/^\/+|\/+$/gu, "")}/`;

const baseRouteUrl = (basePath: string, routePath: string) =>
  basePath === "/"
    ? routePath
    : `/${normalizeBasePath(basePath).replace(/^\//u, "")}${routePath.replace(/^\//u, "")}`;

const buildFallbackScript = (basePath: string) => {
  const normalizedBase = `/${normalizeBasePath(basePath)}`.replace(/\/+/gu, "/");

  return `(() => {
  const basePath = ${JSON.stringify(normalizedBase)};
  const pathname = window.location.pathname;
  const routePath = basePath !== "/" && pathname.startsWith(basePath)
    ? "/" + pathname.slice(basePath.length)
    : pathname;
  const normalizedRoute = routePath === "/"
    ? "/"
    : routePath.replace(/\\/+$/u, "") + "/";
  const isLegacyTaxonomy = normalizedRoute === "/tags/"
    || normalizedRoute.startsWith("/tags/")
    || normalizedRoute === "/places/"
    || normalizedRoute.startsWith("/places/");
  const targetRoute = isLegacyTaxonomy ? "/menu/" : "/";
  const destination = basePath === "/"
    ? targetRoute
    : basePath + targetRoute.slice(1);
  window.location.replace(destination);
})();`;
};

const routeHeadPlugin = (siteOrigin: string): Plugin => {
  let resolvedConfig: ResolvedConfig;

  return {
    name: "aroma-route-heads",
    configResolved(config) {
      resolvedConfig = config;
    },
    transformIndexHtml: {
      order: "pre",
      handler(html, context) {
        const normalizedFilename = context.filename.replaceAll("\\", "/");
        const normalizedRoot = resolvedConfig.root.replaceAll("\\", "/");
        const htmlPath = normalizedFilename.startsWith(`${normalizedRoot}/`)
          ? normalizedFilename.slice(normalizedRoot.length + 1)
          : normalizedFilename;

        if (htmlPath === "404.html") {
          const fallbackHome = baseRouteUrl(resolvedConfig.base, "/");

          return html
            .replace(FALLBACK_SCRIPT_MARKER, buildFallbackScript(resolvedConfig.base))
            .replaceAll("__AROMA_FALLBACK_HOME__", fallbackHome);
        }

        const entry = findRouteEntryByHtmlPath(htmlPath);

        if (!entry) {
          return html;
        }

        return html.replace(
          ROUTE_HEAD_MARKER,
          buildRouteHeadHtml(routeDefinitionForEntry(entry), {
            siteOrigin,
            basePath: resolvedConfig.base,
            canonicalPath: entry.canonicalPath,
          }),
        );
      },
    },
  };
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  const isSsrBuild = mode === "ssr";
  const siteOrigin = (
    env.SITE_ORIGIN ||
    env.VITE_SITE_ORIGIN ||
    DEFAULT_SITE_ORIGIN
  ).replace(/\/+$/u, "");

  return {
    base: "/",
    plugins: [react(), routeHeadPlugin(siteOrigin)],
    build: isSsrBuild
      ? {
          outDir: "dist/.ssr",
          emptyOutDir: false,
          copyPublicDir: false,
        }
      : {
          rollupOptions: {
            input: [...routeHtmlInputs, "404.html"],
          },
        },
  };
});
