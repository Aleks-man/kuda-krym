import type { CoastalLocation } from "@kuda-krym/contracts";

export function filterCoastalLocations(
  locations: readonly CoastalLocation[],
  query: string,
) {
  const normalizedQuery = query.trim().toLocaleLowerCase("ru");

  if (!normalizedQuery) return locations;

  return locations.filter(({ name }) =>
    name.toLocaleLowerCase("ru").includes(normalizedQuery),
  );
}