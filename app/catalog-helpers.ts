import type { CatalogProduct, ProductImage } from "./catalog";

const unknownMarkers = [
  "در دست",
  "نامشخص",
  "نیازمند کارشناسی",
  "احتمالاً",
];

const contextMarkers = [
  "context",
  "courtyard",
  "garden",
  "architecture",
  "weaving-room",
  "display-context",
];

export function isKnownValue(value?: string) {
  if (!value?.trim()) return false;
  return !unknownMarkers.some((marker) => value.includes(marker));
}

export function formatPrice(price: number) {
  return `${price.toLocaleString("fa-IR")} تومان`;
}

export function collectionLabel(product: CatalogProduct) {
  return product.collection === "antique" ? "آنتیک و نیمه‌آنتیک" : "برای خانه";
}

export function getContextImage(product: CatalogProduct): ProductImage | undefined {
  return product.images.find((image) =>
    contextMarkers.some((marker) => image.src.includes(marker)),
  );
}

export function getDetailImage(product: CatalogProduct): ProductImage | undefined {
  return product.images.find((image) =>
    /detail|construction|corner|border|pile|medallion/.test(image.src),
  );
}

export function productSearchText(product: CatalogProduct) {
  return [
    product.name,
    product.sku,
    product.origin,
    product.originName,
    product.pattern,
    product.fieldColor,
    product.borderColor,
    product.description,
  ]
    .join(" ")
    .toLocaleLowerCase("fa-IR");
}
