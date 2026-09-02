import { seedBeachImages } from "../prisma/seed-data/beach-images.js";
import { seedBeaches } from "../prisma/seed-data/beaches.js";
import { supportedImageLicenses } from "../prisma/seed-data/beach-images/beach-image.types.js";

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

  checkUnique(localUrls, image.localUrl, `${label}: duplicate local URL`);
  checkUnique(sourceUrls, image.sourceUrl, `${label}: duplicate source URL`);

  if (!image.localUrl.startsWith(`/images/beaches/${image.beachSlug}-`)) {
    failures.push(`${label}: local URL must start with the beach slug`);
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

  if (image.isCover) {
    checkUnique(
      coverSlugs,
      image.beachSlug,
      `${label}: beach has more than one cover image`,
    );
  }
}

if (failures.length > 0) {
  throw new Error(`Invalid beach image data:\n${failures.join("\n")}`);
}

console.log(
  `Validated attribution metadata for ${seedBeachImages.length} beach image record(s).`,
);

function checkUnique(values: Set<string>, value: string, message: string): void {
  if (values.has(value)) failures.push(message);
  values.add(value);
}
