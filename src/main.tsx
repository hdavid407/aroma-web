import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

const rootElement = document.getElementById("root")!;
const routePath =
  rootElement.getAttribute("data-route-path") ??
  document.body.getAttribute("data-route-path") ??
  document.documentElement.getAttribute("data-route-path") ??
  window.location.pathname;
const renderPath = rootElement.getAttribute("data-render-path") ?? routePath;
const basePath = import.meta.env.BASE_URL;
const app = (
  <StrictMode>
    <App routePath={renderPath} basePath={basePath} />
  </StrictMode>
);

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}
