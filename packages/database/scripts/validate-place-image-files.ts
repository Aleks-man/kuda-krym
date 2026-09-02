import { readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

import { collectPlaceImageAssets } from "./media/place-image-assets.js";
import {
  getPlaceImagesDirectory,
  resolvePlaceImagePath,
} from "./media/place-image-path.js";

const assets = collectPlaceImageAssets();
const expectedFiles = new Set(
  assets.map((asset) => path.basename(resolvePlaceImagePath(asset.localUrl))),
);
const directoryEntries = await readdir(getPlaceImagesDirectory(), {
  withFileTypes: true,
});
const actualFiles = new Set(
  directoryEntries.filter((entry) => entry.isFile()).map((entry) => entry.name),
);
const failures: string[] = [];

for (const entry of directoryEntries) {
  if (!entry.isFile() || !expectedFiles.has(entry.name)) {
    failures.push(`Unexpected entry in place images directory: ${entry.name}`);
  }
}

for (const asset of assets) {
  const fileName = path.basename(resolvePlaceImagePath(asset.localUrl));

  if (!actualFiles.has(fileName)) {
    failures.push(`Missing place image: ${asset.localUrl}`);
    continue;
  }

  try {
    const metadata = await sharp(resolvePlaceImagePath(asset.localUrl)).metadata();

    if (metadata.format !== "webp") {
      failures.push(`${asset.localUrl}: expected WebP, received ${metadata.format}`);
    }
    if (metadata.width !== 1280 || metadata.height !== 800) {
      failures.push(
        `${asset.localUrl}: expected 1280x800, received ${metadata.width}x${metadata.height}`,
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    failures.push(`${asset.localUrl}: unreadable image (${message})`);
  }
}

if (failures.length > 0) {
  throw new Error(`Invalid place image files:\n${failures.join("\n")}`);
}

console.log(`Validated ${assets.length} optimized place image file(s).`);
