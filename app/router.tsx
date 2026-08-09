import type { ReactElement } from "react";
import { catalogProducts, getCatalogProduct } from "./catalog";
import { isContextImage } from "./catalog-helpers";
import {
  AboutPage,
  ContactPage,
  GuidePageView,
  GuidesIndexPage,
  NotFoundPage,
  OriginPageView,
  OriginsIndexPage,
} from "./content-pages";
import Home from "./page";
import ProductPage from "./product-page";
import { getGuidePage, getOriginGroup, guidePages, originGroups } from "./seo-content";
import type { SeoData } from "./seo";
import {
  aboutSeo,
  contactSeo,
  guideSeo,
  guidesIndexSeo,
  homeSeo,
  notFoundSeo,
  originSeo,
  originsIndexSeo,
  productSeo,
} from "./seo";

export type ResolvedRoute = {
  element: ReactElement;
  seo: SeoData;
  status: 200 | 404;
  images: string[];
};

export const prerenderPaths = [
  "/",
  ...catalogProducts.map((product) => `/carpets/${product.slug}/`),
  "/guides/",
  ...guidePages.map((guide) => `/guides/${guide.slug}/`),
  "/origins/",
  ...originGroups.map((origin) => `/origins/${origin.slug}/`),
  "/about/",
  "/contact/",
] as const;

export function normalizePathname(pathname: string) {
  const clean = pathname.split("?")[0].split("#")[0] || "/";
  if (clean === "/") return "/";
  return `/${clean.replace(/^\/+|\/+$/g, "")}/`;
}

export function resolveRoute(pathname: string): ResolvedRoute {
  const path = normalizePathname(pathname);
  if (path === "/") {
    return { element: <Home />, seo: homeSeo(), status: 200, images: catalogProducts.map((product) => product.image) };
  }

  const productMatch = path.match(/^\/carpets\/([^/]+)\/$/);
  if (productMatch) {
    const product = getCatalogProduct(productMatch[1]);
    if (product) {
      return {
        element: <ProductPage product={product} />,
        seo: productSeo(product),
        status: 200,
        images: product.images.filter((image) => !isContextImage(image)).map((image) => image.src),
      };
    }
  }

  if (path === "/guides/") {
    return { element: <GuidesIndexPage />, seo: guidesIndexSeo(), status: 200, images: [] };
  }

  const guideMatch = path.match(/^\/guides\/([^/]+)\/$/);
  if (guideMatch) {
    const guide = getGuidePage(guideMatch[1]);
    if (guide) return { element: <GuidePageView guide={guide} />, seo: guideSeo(guide), status: 200, images: [] };
  }

  if (path === "/origins/") {
    return {
      element: <OriginsIndexPage />,
      seo: originsIndexSeo(),
      status: 200,
      images: catalogProducts.map((product) => product.image),
    };
  }

  const originMatch = path.match(/^\/origins\/([^/]+)\/$/);
  if (originMatch) {
    const origin = getOriginGroup(originMatch[1]);
    if (origin) {
      const products = catalogProducts.filter((product) => origin.originNames.includes(product.originName));
      return {
        element: <OriginPageView origin={origin} />,
        seo: originSeo(origin, products),
        status: 200,
        images: products.map((product) => product.image),
      };
    }
  }

  if (path === "/about/") {
    return { element: <AboutPage />, seo: aboutSeo(), status: 200, images: [] };
  }

  if (path === "/contact/") {
    return { element: <ContactPage />, seo: contactSeo(), status: 200, images: [] };
  }

  return { element: <NotFoundPage />, seo: notFoundSeo(), status: 404, images: [] };
}
