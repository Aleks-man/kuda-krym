export type DepartureLocationCacheKey = `departure-location:search:v2:${string}`;

export function createDepartureLocationCacheKey(
  query: string,
): DepartureLocationCacheKey {
  const normalizedQuery = query.trim().replace(/\s+/g, " ").toLocaleLowerCase("ru");
  return `departure-location:search:v2:${encodeURIComponent(normalizedQuery)}`;
}
