import { seedCoastalLocationImages } from "../prisma/seed-data/coastal-location-images.js";
import { seedCoastalLocations } from "../prisma/seed-data/coastal-locations.js";
import {
  checkUnique,
  validateLicensedImage,
} from "./validation/licensed-image.validation.js";

const locationSlugs = new Set(seedCoastalLocations.map((location) => location.slug));
const placements = new Set<string>();
const coverSlugs = new Set<string>();
const failures: string[] = [];

for (const image of seedCoastalLocationImages) {
  const label = `${image.coastalLocationSlug}: ${image.title}`;

  if (!locationSlugs.has(image.coastalLocationSlug)) {
    failures.push(`${label}: unknown coastal location slug`);
  }

  failures.push(...validateLicensedImage(image, label));
  checkUnique(
    placements,
    `${image.coastalLocationSlug}:${image.localUrl}`,
    `${label}: duplicate image placement`,
    failures,
  );

  if (image.isCover) {
    checkUnique(
      coverSlugs,
      image.coastalLocationSlug,
      `${label}: location has more than one cover image`,
      failures,
    );
  }
}

if (failures.length > 0) {
  throw new Error(`Invalid coastal location image data:\n${failures.join("\n")}`);
}

console.log(
  `Validated attribution metadata for ${seedCoastalLocationImages.length} coastal location image record(s).`,
);
