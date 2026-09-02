import { seedBeachImages } from "../prisma/seed-data/beach-images.js";
import { seedBeaches } from "../prisma/seed-data/beaches.js";
import {
  checkUnique,
  validateLicensedImage,
} from "./validation/licensed-image.validation.js";

const beachSlugs = new Set(seedBeaches.map((beach) => beach.slug));
const localUrls = new Set<string>();
const sourceUrls = new Set<string>();
const coverSlugs = new Set<string>();
const failures: string[] = [];

for (const image of seedBeachImages) {
  const label = `${image.beachSlug}: ${image.title}`;

  if (!beachSlugs.has(image.beachSlug)) {
    failures.push(`${label}: unknown beach slug`);
  }

  failures.push(...validateLicensedImage(image, label));
  checkUnique(localUrls, image.localUrl, `${label}: duplicate local URL`, failures);
  checkUnique(sourceUrls, image.sourceUrl, `${label}: duplicate source URL`, failures);

  if (image.isCover) {
    checkUnique(
      coverSlugs,
      image.beachSlug,
      `${label}: beach has more than one cover image`,
      failures,
    );
  }
}

if (failures.length > 0) {
  throw new Error(`Invalid beach image data:\n${failures.join("\n")}`);
}

console.log(
  `Validated attribution metadata for ${seedBeachImages.length} beach image record(s).`,
);
