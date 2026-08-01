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

export function formatPrice(product: Pick<CatalogProduct, "priceToman" | "priceUsd">) {
  if (product.priceUsd !== undefined) {
    return `${product.priceUsd.toLocaleString("fa-IR")} دلار آمریکا`;
  }
  if (product.priceToman !== undefined) {
    return `${product.priceToman.toLocaleString("fa-IR")} تومان`;
  }
  return "برای استعلام";
}

export function compareCatalogPrices(
  left: CatalogProduct,
  right: CatalogProduct,
  direction: "asc" | "desc",
) {
  const leftCurrency = left.priceToman !== undefined ? 0 : left.priceUsd !== undefined ? 1 : 2;
  const rightCurrency = right.priceToman !== undefined ? 0 : right.priceUsd !== undefined ? 1 : 2;
  if (leftCurrency !== rightCurrency) return leftCurrency - rightCurrency;

  const leftAmount = left.priceToman ?? left.priceUsd ?? 0;
  const rightAmount = right.priceToman ?? right.priceUsd ?? 0;
  return direction === "asc" ? leftAmount - rightAmount : rightAmount - leftAmount;
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
