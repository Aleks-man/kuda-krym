import fallback from "./sitemap-catalog.json";

type CatalogItem = Readonly<{ slug: string }>;
type CatalogLoader = () => Promise<Readonly<{ data: readonly CatalogItem[] }>>;

export async function loadSitemapCatalog(
  loadBeaches: CatalogLoader,
  loadCoastalLocations: CatalogLoader,
) {
  const [beaches, locations] = await Promise.allSettled([loadBeaches(), loadCoastalLocations()]);
  if (beaches.status === "rejected" || locations.status === "rejected") {
    console.warn("Sitemap catalog API unavailable; using the bundled catalog for failed sources.");
  }
  return {
    beachSlugs: beaches.status === "fulfilled" ? beaches.value.data.map(item => item.slug) : fallback.beachSlugs,
    coastalLocationSlugs: locations.status === "fulfilled" ? locations.value.data.map(item => item.slug) : fallback.coastalLocationSlugs,
  };
}
