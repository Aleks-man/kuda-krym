import { seedBeachImages } from "../../prisma/seed-data/beach-images.js";
import { seedCoastalLocationImages } from "../../prisma/seed-data/coastal-location-images.js";
import type { LicensedImageAsset } from "../../prisma/seed-data/media/licensed-image.types.js";

export type PlaceImageAsset = Pick<
  LicensedImageAsset,
  "downloadUrl" | "localUrl" | "title"
>;

export function collectPlaceImageAssets(): readonly PlaceImageAsset[] {
  const assetsByLocalUrl = new Map<string, PlaceImageAsset>();

  for (const asset of [...seedBeachImages, ...seedCoastalLocationImages]) {
    const existing = assetsByLocalUrl.get(asset.localUrl);

    if (existing && existing.downloadUrl !== asset.downloadUrl) {
      throw new Error(
        `Conflicting download URLs for ${asset.localUrl}: ${existing.downloadUrl} and ${asset.downloadUrl}`,
      );
    }

    assetsByLocalUrl.set(asset.localUrl, {
      downloadUrl: asset.downloadUrl,
      localUrl: asset.localUrl,
      title: asset.title,
    });
  }

  return [...assetsByLocalUrl.values()].sort((left, right) =>
    left.localUrl.localeCompare(right.localUrl),
  );
}
