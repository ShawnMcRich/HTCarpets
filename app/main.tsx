import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { getCatalogProduct } from "./catalog";
import Home from "./page";
import ProductPage from "./product-page";
import "./globals.css";

const productMatch = window.location.pathname.match(/^\/carpets\/([^/]+)\/?$/);
const product = productMatch ? getCatalogProduct(productMatch[1]) : undefined;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {product ? <ProductPage product={product} /> : <Home />}
  </StrictMode>,
);
