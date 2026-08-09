import fs from "node:fs/promises";
import path from "node:path";
import { renderToString } from "react-dom/server";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { prerenderPaths, resolveRoute } from "./app/router";
import { absoluteMediaUrl, canonicalUrl, lastContentReview, type SeoData } from "./app/seo";

const SEO_HEAD_PATTERN = /<!-- SEO_HEAD_START -->[\s\S]*?<!-- SEO_HEAD_END -->/;
const ROOT_PATTERN = /<div id="root"><\/div>/;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeXml(value: string) {
  return escapeHtml(value);
}

function seoHead(seo: SeoData) {
  const canonical = canonicalUrl(seo.canonicalPath);
  const robots = seo.robots ?? "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
  const image = seo.image ? absoluteMediaUrl(seo.image) : undefined;
  const lines = [
    "<!-- SEO_HEAD_START -->",
    `    <meta data-seo-managed="true" name="description" content="${escapeHtml(seo.description)}" />`,
    `    <meta data-seo-managed="true" name="robots" content="${escapeHtml(robots)}" />`,
    `    <meta data-seo-managed="true" name="googlebot" content="${escapeHtml(robots)}" />`,
    `    <link data-seo-managed="true" rel="canonical" href="${escapeHtml(canonical)}" />`,
    `    <link data-seo-managed="true" rel="alternate" hreflang="fa-IR" href="${escapeHtml(canonical)}" />`,
    `    <link data-seo-managed="true" rel="alternate" hreflang="x-default" href="${escapeHtml(canonical)}" />`,
    "    <meta data-seo-managed=\"true\" property=\"og:locale\" content=\"fa_IR\" />",
    `    <meta data-seo-managed="true" property="og:type" content="${escapeHtml(seo.type ?? "website")}" />`,
    "    <meta data-seo-managed=\"true\" property=\"og:site_name\" content=\"فرش حسین‌طلب\" />",
    `    <meta data-seo-managed="true" property="og:title" content="${escapeHtml(seo.title)}" />`,
    `    <meta data-seo-managed="true" property="og:description" content="${escapeHtml(seo.description)}" />`,
    `    <meta data-seo-managed="true" property="og:url" content="${escapeHtml(canonical)}" />`,
    "    <meta data-seo-managed=\"true\" name=\"twitter:card\" content=\"summary_large_image\" />",
    `    <meta data-seo-managed="true" name="twitter:title" content="${escapeHtml(seo.title)}" />`,
    `    <meta data-seo-managed="true" name="twitter:description" content="${escapeHtml(seo.description)}" />`,
  ];

  if (image) {
    lines.push(
      `    <meta data-seo-managed="true" property="og:image" content="${escapeHtml(image)}" />`,
      `    <meta data-seo-managed="true" property="og:image:alt" content="${escapeHtml(seo.imageAlt ?? seo.title)}" />`,
      `    <meta data-seo-managed="true" name="twitter:image" content="${escapeHtml(image)}" />`,
    );
  }

  for (const data of seo.structuredData) {
    const json = JSON.stringify(data).replace(/</g, "\\u003c");
    lines.push(`    <script data-seo-managed="true" type="application/ld+json">${json}</script>`);
  }

  lines.push(`    <title>${escapeHtml(seo.title)}</title>`, "    <!-- SEO_HEAD_END -->");
  return lines.join("\n");
}

function renderDocument(template: string, routePath: string) {
  const route = resolveRoute(routePath);
  const markup = renderToString(route.element);
  return template
    .replace(SEO_HEAD_PATTERN, seoHead(route.seo))
    .replace(ROOT_PATTERN, `<div id="root">${markup}</div>`);
}

function sitemapXml() {
  const urls = prerenderPaths.map((routePath) => {
    const route = resolveRoute(routePath);
    const images = [...new Set(route.images)].map((image) =>
      `    <image:image><image:loc>${escapeXml(absoluteMediaUrl(image))}</image:loc></image:image>`,
    );
    return [
      "  <url>",
      `    <loc>${escapeXml(canonicalUrl(routePath))}</loc>`,
      `    <lastmod>${lastContentReview}</lastmod>`,
      ...images,
      "  </url>",
    ].join("\n");
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");
}

function prerenderPlugin(): Plugin {
  return {
    name: "hosseintalab-prerender",
    apply: "build",
    async closeBundle() {
      const outputRoot = path.resolve("dist");
      const templatePath = path.join(outputRoot, "index.html");
      const template = await fs.readFile(templatePath, "utf8");

      for (const routePath of prerenderPaths) {
        const outputPath = routePath === "/"
          ? templatePath
          : path.join(outputRoot, routePath.slice(1), "index.html");
        await fs.mkdir(path.dirname(outputPath), { recursive: true });
        await fs.writeFile(outputPath, renderDocument(template, routePath));
      }

      await fs.writeFile(path.join(outputRoot, "404.html"), renderDocument(template, "/404.html"));
      await fs.writeFile(path.join(outputRoot, "sitemap.xml"), sitemapXml());
    },
  };
}

export default defineConfig({
  plugins: [react(), prerenderPlugin()],
  server: {
    host: "127.0.0.1",
  },
});
