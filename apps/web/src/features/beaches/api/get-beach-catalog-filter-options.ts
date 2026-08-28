import {
  beachCatalogFilterOptionsSchema,
  type BeachCatalogFilterOptions,
} from "@kuda-krym/contracts";

const defaultApiUrl = "http://127.0.0.1:4000";

export async function getBeachCatalogFilterOptions(): Promise<BeachCatalogFilterOptions> {
  const apiUrl = process.env.API_URL ?? defaultApiUrl;
  const response = await fetch(
    new URL("/api/beaches/filter-options", apiUrl),
    { next: { revalidate: 300 } },
  );

  if (!response.ok) {
    throw new Error(`Beach filter options API returned status ${response.status}`);
  }

  return beachCatalogFilterOptionsSchema.parse(await response.json());
}
