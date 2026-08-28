import type { BeachCatalogQuery } from "@kuda-krym/contracts";

export function createBeachCatalogUrl(
  apiUrl: string,
  query: BeachCatalogQuery,
): URL {
  const url = new URL("/api/beaches", apiUrl);

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) url.searchParams.set(key, value);
  }

  return url;
}
