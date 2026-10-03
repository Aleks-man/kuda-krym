import { readFileSync, writeFileSync } from "node:fs";
import { seedBeaches } from "../prisma/seed-data/beaches.js";
import { seedCoastalLocations } from "../prisma/seed-data/coastal-locations.js";
const file = new URL("../../../apps/web/src/shared/seo/sitemap-catalog.json", import.meta.url);
const catalog = {
  beachSlugs: seedBeaches.map(item => item.slug).sort(),
  coastalLocationSlugs: seedCoastalLocations.map(item => item.slug).sort(),
};
if (process.argv.includes("--write")) writeFileSync(file, JSON.stringify(catalog, null, 2) + "\n");
const saved = JSON.parse(readFileSync(file, "utf8"));
if (JSON.stringify(saved) !== JSON.stringify(catalog)) {
  throw new Error("Sitemap fallback differs from seed catalog. Run npm run sitemap:catalog:update --workspace @kuda-krym/database");
}
console.log(`Validated sitemap fallback: ${catalog.beachSlugs.length} beaches, ${catalog.coastalLocationSlugs.length} coastal locations.`);
