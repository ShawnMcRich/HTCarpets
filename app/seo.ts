import type { CatalogProduct } from "./catalog";
import { catalogProducts } from "./catalog";
import { formatPrice, isContextImage, isKnownValue } from "./catalog-helpers";
import { contact } from "./contact";
import type { GuidePage, OriginGroup } from "./seo-content";

export type SeoData = {
  title: string;
  description: string;
  canonicalPath: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article" | "product";
  robots?: string;
  structuredData: Record<string, unknown>[];
};

export const siteUrl = "https://hosseintalab.ir";
export const defaultShareImage = "/media/products/ht-ksh-0001/full-frontal.webp";
export const lastContentReview = "2026-08-09";

export function canonicalUrl(path: string) {
  if (path === "/") return `${siteUrl}/`;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function absoluteMediaUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export const businessSchema: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": ["HomeGoodsStore", "Organization"],
  "@id": `${siteUrl}/#business`,
  name: "فرش حسین‌طلب",
  alternateName: "Hosseintalab",
  url: `${siteUrl}/`,
  logo: absoluteMediaUrl("/brand/raster/hosseintalab-medallion-transparent.png"),
  image: absoluteMediaUrl(defaultShareImage),
  description:
    "فروشگاه فرش دستباف ایرانی در بازار فرش تهران با مجموعه‌ای از فرش‌های تک‌تخته، تصاویر همان فرش، ابعاد، قیمت و راهنمای بررسی پیش از خرید.",
  telephone: contact.callDisplay.replace(/\s/g, ""),
  address: {
    "@type": "PostalAddress",
    streetAddress: "خیابان خیام شمالی، جنب مترو خیام، ساختمان بازار فرش، طبقه‌ی اول، پلاک ۶۶",
    addressLocality: "تهران",
    addressRegion: "تهران",
    addressCountry: "IR",
  },
  hasMap: contact.mapsHref,
  sameAs: [contact.instagramHref],
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: contact.callDisplay.replace(/\s/g, ""),
      contactType: "customer service",
      availableLanguage: ["fa"],
    },
  ],
  knowsAbout: [
    "فرش دستباف ایرانی",
    "فرش دستباف قدیمی و آنتیک",
    "بررسی وضعیت فرش",
    "انتخاب اندازه‌ی فرش برای خانه",
  ],
};

function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}

function productListSchema(products: CatalogProduct[], name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: canonicalUrl(`/carpets/${product.slug}/`),
      name: product.name,
      image: absoluteMediaUrl(product.image),
    })),
  };
}

export function homeSeo(): SeoData {
  return {
    title: "خرید فرش دستباف ایرانی با قیمت و شناسنامه | حسین‌طلب",
    description:
      "مجموعه‌ی فرش دستباف ایرانی حسین‌طلب در بازار فرش تهران؛ مشاهده‌ی قیمت، ابعاد، نمای کامل، جزئیات بافت و راهنمای انتخاب هر فرش تک‌تخته.",
    canonicalPath: "/",
    image: defaultShareImage,
    imageAlt: "فرش دستباف ایرانی از مجموعه‌ی حسین‌طلب",
    type: "website",
    structuredData: [
      businessSchema,
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: "فرش حسین‌طلب",
        alternateName: "Hosseintalab",
        url: `${siteUrl}/`,
        inLanguage: "fa-IR",
        publisher: { "@id": `${siteUrl}/#business` },
      },
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${siteUrl}/#homepage`,
        url: `${siteUrl}/`,
        name: "خرید فرش دستباف ایرانی با قیمت و شناسنامه",
        description:
          "مجموعه‌ی فرش‌های دستباف تک‌تخته با تصاویر، ابعاد، قیمت و اطلاعات قابل بررسی.",
        inLanguage: "fa-IR",
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: { "@id": `${siteUrl}/#business` },
      },
      productListSchema(catalogProducts, "مجموعه‌ی فرش‌های دستباف موجود حسین‌طلب"),
    ],
  };
}

export function productSeo(product: CatalogProduct): SeoData {
  const path = `/carpets/${product.slug}/`;
  const currency = product.priceToman !== undefined ? "IRR" : "USD";
  const numericPrice = product.priceToman !== undefined
    ? product.priceToman * 10
    : product.priceUsd;
  const additionalProperty = [
    { name: "محل بافت", value: product.originName, known: true },
    { name: "ابعاد", value: product.dimensions, known: isKnownValue(product.dimensions) },
    { name: "طرح و نقشه", value: product.pattern, known: true },
    { name: "جنس ثبت‌شده", value: product.materials, known: isKnownValue(product.materials) },
    { name: "قدمت تقریبی", value: product.ageLabel, known: isKnownValue(product.ageLabel) },
  ]
    .filter((property) => property.known)
    .map((property) => ({ "@type": "PropertyValue", name: property.name, value: property.value }));

  const productSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${canonicalUrl(path)}#product`,
    name: product.name,
    description: product.longDescription,
    sku: product.sku,
    url: canonicalUrl(path),
    image: product.images.filter((image) => !isContextImage(image)).map((image) => absoluteMediaUrl(image.src)),
    category: product.collection === "antique" ? "فرش دستباف قدیمی و آنتیک" : "فرش دستباف برای خانه",
    brand: { "@type": "Brand", name: "حسین‌طلب" },
    color: `${product.fieldColor}؛ ${product.borderColor}`,
    additionalProperty,
    offers: {
      "@type": "Offer",
      url: canonicalUrl(path),
      priceCurrency: currency,
      price: numericPrice,
      availability: "https://schema.org/LimitedAvailability",
      seller: { "@id": `${siteUrl}/#business` },
    },
  };

  if (isKnownValue(product.materials)) productSchema.material = product.materials;

  return {
    title: `${product.name}؛ قیمت، ابعاد و تصاویر کامل | حسین‌طلب`,
    description: `${product.name}، بافت ${product.originName}، ابعاد ${product.dimensions} و قیمت ${formatPrice(product)}. نمای کامل، جزئیات نقش و توضیح وضعیت این فرش دستباف را ببینید.`,
    canonicalPath: path,
    image: product.image,
    imageAlt: product.alt,
    type: "product",
    structuredData: [
      businessSchema,
      productSchema,
      breadcrumbSchema([
        { name: "صفحه‌ی نخست", path: "/" },
        { name: "مجموعه‌ی فرش‌ها", path: "/#collection" },
        { name: product.name, path },
      ]),
    ],
  };
}

export function guidesIndexSeo(): SeoData {
  const path = "/guides/";
  return {
    title: "راهنمای خرید و شناخت فرش دستباف | حسین‌طلب",
    description:
      "راهنمای روشن خرید فرش دستباف؛ انتخاب اندازه برای خانه، بررسی پشت و لبه، شناخت فرش قدیمی، نقش‌های ایرانی و نگهداری درست.",
    canonicalPath: path,
    type: "website",
    structuredData: [
      businessSchema,
      breadcrumbSchema([
        { name: "صفحه‌ی نخست", path: "/" },
        { name: "راهنمای فرش دستباف", path },
      ]),
    ],
  };
}

export function guideSeo(guide: GuidePage): SeoData {
  const path = `/guides/${guide.slug}/`;
  return {
    title: `${guide.shortTitle} | حسین‌طلب`,
    description: guide.description,
    canonicalPath: path,
    type: "article",
    structuredData: [
      businessSchema,
      {
        "@context": "https://schema.org",
        "@type": "Article",
        "@id": `${canonicalUrl(path)}#article`,
        headline: guide.title,
        description: guide.description,
        url: canonicalUrl(path),
        inLanguage: "fa-IR",
        dateModified: lastContentReview,
        author: { "@id": `${siteUrl}/#business` },
        publisher: { "@id": `${siteUrl}/#business` },
        mainEntityOfPage: canonicalUrl(path),
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: guide.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
      breadcrumbSchema([
        { name: "صفحه‌ی نخست", path: "/" },
        { name: "راهنمای فرش دستباف", path: "/guides/" },
        { name: guide.shortTitle, path },
      ]),
    ],
  };
}

export function originsIndexSeo(): SeoData {
  const path = "/origins/";
  return {
    title: "فرش دستباف شهرهای ایران؛ نمونه‌ها و قیمت | حسین‌طلب",
    description:
      "فرش‌های دستباف موجود را بر پایه‌ی محل بافت ببینید؛ کاشان، قم، اصفهان، کرمان، تبریز، سیرجان، سنندج و شهرهای دیگر با قیمت و تصاویر کامل.",
    canonicalPath: path,
    type: "website",
    structuredData: [
      businessSchema,
      productListSchema(catalogProducts, "فرش‌های دستباف بر پایه‌ی محل بافت"),
      breadcrumbSchema([
        { name: "صفحه‌ی نخست", path: "/" },
        { name: "محل بافت", path },
      ]),
    ],
  };
}

export function originSeo(origin: OriginGroup, products: CatalogProduct[]): SeoData {
  const path = `/origins/${origin.slug}/`;
  return {
    title: `${origin.title}؛ قیمت و تصاویر | حسین‌طلب`,
    description: `${origin.summary} قیمت، ابعاد و تصاویر کامل ${products.length.toLocaleString("fa-IR")} تخته‌ی ثبت‌شده را مقایسه کنید.`,
    canonicalPath: path,
    image: products[0]?.image,
    imageAlt: products[0]?.alt,
    type: "website",
    structuredData: [
      businessSchema,
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${canonicalUrl(path)}#collection`,
        name: origin.title,
        description: origin.summary,
        url: canonicalUrl(path),
        inLanguage: "fa-IR",
        mainEntity: productListSchema(products, origin.title),
      },
      breadcrumbSchema([
        { name: "صفحه‌ی نخست", path: "/" },
        { name: "محل بافت", path: "/origins/" },
        { name: origin.name, path },
      ]),
    ],
  };
}

export function aboutSeo(): SeoData {
  const path = "/about/";
  return {
    title: "درباره‌ی فرش حسین‌طلب | بازار فرش تهران",
    description:
      "درباره‌ی فرش حسین‌طلب؛ کسب‌وکار خانوادگی در بازار فرش تهران با تمرکز بر نمایش کامل هر فرش دستباف، اطلاعات روشن و انتخاب کم‌ریسک‌تر.",
    canonicalPath: path,
    type: "website",
    structuredData: [
      businessSchema,
      {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "درباره‌ی فرش حسین‌طلب",
        url: canonicalUrl(path),
        inLanguage: "fa-IR",
        about: { "@id": `${siteUrl}/#business` },
      },
      breadcrumbSchema([
        { name: "صفحه‌ی نخست", path: "/" },
        { name: "درباره‌ی حسین‌طلب", path },
      ]),
    ],
  };
}

export function contactSeo(): SeoData {
  const path = "/contact/";
  return {
    title: "آدرس و تماس فرش حسین‌طلب | بازار فرش تهران",
    description: `نشانی فرش حسین‌طلب در بازار فرش تهران، تلفن، واتساپ و اینستاگرام برای پرسش درباره‌ی موجودی، مشاوره و هماهنگی بازدید حضوری.`,
    canonicalPath: path,
    type: "website",
    structuredData: [
      businessSchema,
      {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: "تماس با فرش حسین‌طلب",
        url: canonicalUrl(path),
        inLanguage: "fa-IR",
        about: { "@id": `${siteUrl}/#business` },
      },
      breadcrumbSchema([
        { name: "صفحه‌ی نخست", path: "/" },
        { name: "تماس و نشانی", path },
      ]),
    ],
  };
}

export function notFoundSeo(): SeoData {
  return {
    title: "صفحه پیدا نشد | فرش حسین‌طلب",
    description: "این صفحه در وب‌سایت فرش حسین‌طلب پیدا نشد.",
    canonicalPath: "/404.html",
    robots: "noindex, nofollow",
    structuredData: [],
  };
}

function addMeta(name: string, content: string, property = false) {
  const element = document.createElement("meta");
  element.setAttribute(property ? "property" : "name", name);
  element.setAttribute("content", content);
  element.dataset.seoManaged = "true";
  document.head.appendChild(element);
}

export function applySeo(seo: SeoData) {
  document.title = seo.title;
  document.head.querySelectorAll("[data-seo-managed]").forEach((element) => element.remove());

  addMeta("description", seo.description);
  addMeta("robots", seo.robots ?? "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
  addMeta("googlebot", seo.robots ?? "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
  addMeta("og:locale", "fa_IR", true);
  addMeta("og:type", seo.type ?? "website", true);
  addMeta("og:site_name", "فرش حسین‌طلب", true);
  addMeta("og:title", seo.title, true);
  addMeta("og:description", seo.description, true);
  addMeta("og:url", canonicalUrl(seo.canonicalPath), true);
  addMeta("twitter:card", "summary_large_image");
  addMeta("twitter:title", seo.title);
  addMeta("twitter:description", seo.description);

  if (seo.image) {
    addMeta("og:image", absoluteMediaUrl(seo.image), true);
    addMeta("og:image:alt", seo.imageAlt ?? seo.title, true);
    addMeta("twitter:image", absoluteMediaUrl(seo.image));
  }

  const canonical = document.createElement("link");
  canonical.rel = "canonical";
  canonical.href = canonicalUrl(seo.canonicalPath);
  canonical.dataset.seoManaged = "true";
  document.head.appendChild(canonical);

  for (const hreflang of ["fa-IR", "x-default"]) {
    const alternate = document.createElement("link");
    alternate.rel = "alternate";
    alternate.hreflang = hreflang;
    alternate.href = canonical.href;
    alternate.dataset.seoManaged = "true";
    document.head.appendChild(alternate);
  }

  for (const data of seo.structuredData) {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(data).replace(/</g, "\\u003c");
    script.dataset.seoManaged = "true";
    document.head.appendChild(script);
  }
}
