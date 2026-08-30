import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

const rootElement = document.getElementById("root")!;
const routePath =
  rootElement.getAttribute("data-route-path") ??
  document.body.getAttribute("data-route-path") ??
  document.documentElement.getAttribute("data-route-path") ??
  window.location.pathname;

createRoot(rootElement).render(
  <StrictMode>
    <App routePath={routePath} />
  </StrictMode>,
);
