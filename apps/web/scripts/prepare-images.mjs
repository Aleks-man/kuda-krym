import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, rename, rm, stat, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const inputDirectory = new URL("../public/images/places/", import.meta.url);
const outputDirectory = new URL("../public/images/generated/", import.meta.url);
const manifestPath = new URL("../src/generated/image-manifest.json", import.meta.url);
const widths = [320, 480, 640, 768, 1024, 1280];
const quality = 78;
const manifest = {};
await mkdir(outputDirectory, { recursive: true });
await mkdir(new URL("../src/generated/", import.meta.url), { recursive: true });

// Process sequentially to keep memory bounded in CI and on developer machines.
for (const name of (await readdir(inputDirectory)).sort()) {
  if (!name.endsWith(".webp")) continue;
  const source = await readFile(new URL(name, inputDirectory));
  const metadata = await sharp(source).metadata();
  if (!metadata.width) throw new Error(`Missing image width: ${name}`);
  const hash = createHash("sha256")
    .update(source)
    .update(JSON.stringify({ widths, quality, sharp: sharp.versions, pipeline: 1 }))
    .digest("hex").slice(0, 20);
  const variants = [];
  for (const width of [...new Set(widths.map(value => Math.min(value, metadata.width)))]) {
    const filename = `${hash}-${width}.webp`;
    const destination = new URL(filename, outputDirectory);
    const exists = await stat(destination).then(() => true, error => {
      if (error.code === "ENOENT") return false;
      throw error;
    });
    if (!exists) {
      const temporary = new URL(`${filename}.${process.pid}.tmp`, outputDirectory);
      try {
        await sharp(source).resize({ width, withoutEnlargement: true })
          .webp({ quality, effort: 4 }).toFile(fileURLToPath(temporary));
        await rename(temporary, destination);
      } finally {
        await rm(temporary, { force: true });
      }
    }
    variants.push({ width, url: `/images/generated/${filename}` });
  }
  manifest[`/images/places/${name}`] = variants;
}
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(`Prepared responsive images for ${Object.keys(manifest).length} photographs.`);
