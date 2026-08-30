import { renderToString } from "react-dom/server";
import App from "./App";

export function renderRoute(renderPath: string, basePath: string) {
  return renderToString(<App routePath={renderPath} basePath={basePath} />);
}
