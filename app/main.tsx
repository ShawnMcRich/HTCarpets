import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { resolveRoute } from "./router";
import { applySeo } from "./seo";
import "./globals.css";

const route = resolveRoute(window.location.pathname);
const rootElement = document.getElementById("root")!;
const app = <StrictMode>{route.element}</StrictMode>;

applySeo(route.seo);

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}
