import type { CoastalLocation } from "@kuda-krym/contracts";

import { cities } from "../../cities/model/cities";
import { filterCoastalLocations } from "./filter-coastal-locations";
import { coastalRegionLabels, waterBodyLabels } from "./coastal-location-labels";

export type ForecastPlaceOption = Readonly<{
  id: string;
  name: string;
  slug: string;
  href: string;
  detail: string;
}>;

export function getForecastPlaceOptions(locations: readonly CoastalLocation[], query: string): ForecastPlaceOption[] {
  const options: ForecastPlaceOption[] = filterCoastalLocations(locations, query).map((location) => ({
    id: location.id, name: location.name, slug: location.slug,
    href: `/coast/${location.slug}`,
    detail: `${coastalRegionLabels[location.region]} · ${waterBodyLabels[location.waterBody]}`,
  }));
  const normalizedQuery = query.trim().toLocaleLowerCase("ru");
  for (const city of cities) {
    if (!`${city.name} ${city.areaLabel}`.toLocaleLowerCase("ru").includes(normalizedQuery)) continue;
    options.push({ id: `city-${city.slug}`, name: city.name, slug: city.slug, href: `/cities/${city.slug}`, detail: city.areaLabel });
  }
  return options.sort((a, b) => a.name.localeCompare(b.name, "ru"));
}
