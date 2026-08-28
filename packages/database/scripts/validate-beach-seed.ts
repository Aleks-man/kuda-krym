import { seedBeaches } from "../prisma/seed-data/beaches.js";
import { seedCoastalLocations } from "../prisma/seed-data/coastal-locations.js";

const coastalLocations = new Map(
  seedCoastalLocations.map((location) => [location.slug, location]),
);
const slugs = new Set<string>();
const osmObjects = new Set<string>();
const failures: string[] = [];

for (const beach of seedBeaches) {
  checkUnique(slugs, beach.slug, `${beach.slug}: duplicate slug`);
  checkUnique(
    osmObjects,
    `${beach.osmType}:${beach.osmId}`,
    `${beach.slug}: duplicate OSM object`,
  );

  const latitude = Number(beach.latitude);
  const longitude = Number(beach.longitude);
  if (!Number.isFinite(latitude) || latitude < 44 || latitude > 46.5) {
    failures.push(`${beach.slug}: latitude is outside Crimea`);
  }
  if (!Number.isFinite(longitude) || longitude < 32 || longitude > 37) {
    failures.push(`${beach.slug}: longitude is outside Crimea`);
  }

  const sourceRetrievedAt = Date.parse(beach.sourceRetrievedAt);
  if (!Number.isFinite(sourceRetrievedAt)) {
    failures.push(`${beach.slug}: invalid source retrieval date`);
  } else if (sourceRetrievedAt > Date.now()) {
    failures.push(`${beach.slug}: source retrieval date is in the future`);
  }

  const coastalLocation = coastalLocations.get(beach.coastalLocationSlug);
  if (!coastalLocation) {
    failures.push(`${beach.slug}: unknown coastal forecast location`);
  } else if (coastalLocation.region !== beach.region) {
    failures.push(`${beach.slug}: beach and coastal location regions differ`);
  }
}

if (failures.length > 0) {
  throw new Error(`Invalid beach seed data:\n${failures.join("\n")}`);
}

console.log(
  `Validated ${seedBeaches.length} beaches and their coastal forecast links.`,
);

function checkUnique(values: Set<string>, value: string, message: string): void {
  if (values.has(value)) failures.push(message);
  values.add(value);
}
