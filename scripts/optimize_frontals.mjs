import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const productMediaRoot = path.resolve(scriptDirectory, "../public/media/products");
const entries = await fs.readdir(productMediaRoot, { withFileTypes: true });
let created = 0;
let skipped = 0;

for (const entry of entries) {
  if (!entry.isDirectory() || !entry.name.startsWith("ht-")) continue;

  const inputPath = path.join(productMediaRoot, entry.name, "full-frontal.png");
  const outputPath = path.join(productMediaRoot, entry.name, "full-frontal.webp");

  try {
    await fs.access(inputPath);
  } catch {
    continue;
  }

  try {
    await fs.access(outputPath);
    skipped += 1;
    continue;
  } catch {
    // The optimized derivative does not exist yet.
  }

  await sharp(inputPath)
    .rotate()
    .webp({ quality: 82, effort: 5, smartSubsample: true })
    .toFile(outputPath);
  created += 1;
  process.stdout.write(`created ${path.relative(productMediaRoot, outputPath)}\n`);
}

process.stdout.write(`frontals complete: ${created} created, ${skipped} already present\n`);
