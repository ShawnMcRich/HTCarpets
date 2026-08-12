import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const backgroundPath = path.join(
  root,
  "design/social/hosseintalab-share-background-v1.jpg",
);
const logoPath = path.join(
  root,
  "public/brand/exports/hosseintalab-lockup-horizontal-reversed.png",
);
const fontPath = path.join(
  root,
  "node_modules/@fontsource-variable/vazirmatn/files/vazirmatn-arabic-wght-normal.woff2",
);
const outputPath = path.join(
  root,
  "public/media/social/hosseintalab-share-v1.jpg",
);

const [font, logo] = await Promise.all([
  fs.readFile(fontPath),
  sharp(logoPath).resize({ width: 440 }).png().toBuffer(),
]);

const fontData = font.toString("base64");
const overlay = Buffer.from(`
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <style>
        @font-face {
          font-family: Vazirmatn;
          src: url(data:font/woff2;base64,${fontData}) format('woff2');
          font-weight: 100 900;
        }
        .fa { font-family: Vazirmatn, sans-serif; direction: rtl; unicode-bidi: embed; }
      </style>
    </defs>
    <rect x="17" y="17" width="1166" height="596" fill="none" stroke="#d8bb83" stroke-opacity="0.4" />
    <rect x="1062" y="237" width="78" height="2" fill="#b78b3f" />
    <text class="fa" x="1140" y="323" fill="#f8f1e5" font-size="48" font-weight="430">فرش را کامل ببینید.</text>
    <text class="fa" x="1140" y="394" fill="#d8bb83" font-size="48" font-weight="360">بعد انتخاب کنید.</text>
    <text class="fa" x="1140" y="510" fill="#f8f1e5" fill-opacity="0.78" font-size="17" font-weight="420">مجموعه‌ی فرش دستباف ایرانی</text>
    <text x="1140" y="548" text-anchor="end" fill="#f8f1e5" fill-opacity="0.68" font-family="Georgia, serif" font-size="15" letter-spacing="2.4">HOSSEINTALAB.IR</text>
  </svg>
`);

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await sharp(backgroundPath)
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .composite([
    { input: overlay, left: 0, top: 0 },
    { input: logo, left: 700, top: 67 },
  ])
  .jpeg({ quality: 88, chromaSubsampling: "4:4:4", mozjpeg: true })
  .toFile(outputPath);

console.log(outputPath);
