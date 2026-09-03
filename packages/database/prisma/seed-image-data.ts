import type {
  LicensedImageAsset,
  SeedImagePlacement,
} from "./seed-data/media/licensed-image.types.js";

export function toSeedImageData(
  image: LicensedImageAsset & SeedImagePlacement,
) {
  return {
    url: image.localUrl,
    sourceUrl: image.sourceUrl,
    title: image.title,
    author: image.author,
    license: image.license,
    licenseUrl: image.licenseUrl,
    alt: image.alt,
    sortOrder: image.sortOrder,
    isCover: image.isCover,
  };
}
