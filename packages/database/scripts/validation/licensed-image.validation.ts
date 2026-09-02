import { supportedImageLicenses } from "../../prisma/seed-data/media/licensed-image.types.js";
import type {
  LicensedImageAsset,
  SeedImagePlacement,
} from "../../prisma/seed-data/media/licensed-image.types.js";

export function validateLicensedImage(
  image: LicensedImageAsset & SeedImagePlacement,
  label: string,
): string[] {
  const failures: string[] = [];

  if (!image.localUrl.startsWith("/images/places/")) {
    failures.push(`${label}: local URL must use the places directory`);
  }
  if (!image.sourceUrl.startsWith("https://commons.wikimedia.org/wiki/File:")) {
    failures.push(`${label}: source must be a Wikimedia Commons file page`);
  }
  if (
    !image.downloadUrl.startsWith("https://upload.wikimedia.org/") &&
    !image.downloadUrl.startsWith(
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/",
    )
  ) {
    failures.push(`${label}: download must use a Wikimedia media URL`);
  }
  if (!supportedImageLicenses.includes(image.license)) {
    failures.push(`${label}: unsupported license`);
  }
  if (image.license !== "Public domain" && image.licenseUrl === null) {
    failures.push(`${label}: license URL is required`);
  }
  if (image.author.trim().length === 0 || image.alt.trim().length === 0) {
    failures.push(`${label}: author and alt text are required`);
  }
  if (!Number.isInteger(image.sortOrder) || image.sortOrder < 0) {
    failures.push(`${label}: sort order must be a non-negative integer`);
  }

  const verifiedAt = Date.parse(image.sourceVerifiedAt);
  if (!Number.isFinite(verifiedAt) || verifiedAt > Date.now()) {
    failures.push(`${label}: invalid source verification date`);
  }

  return failures;
}

export function checkUnique(
  values: Set<string>,
  value: string,
  message: string,
  failures: string[],
): void {
  if (values.has(value)) failures.push(message);
  values.add(value);
}
