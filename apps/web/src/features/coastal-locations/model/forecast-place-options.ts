import type { CoastalLocation } from "@kuda-krym/contracts";

import { simferopol } from "../../cities/model/cities";
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
  if (simferopol.name.toLocaleLowerCase("ru").includes(query.trim().toLocaleLowerCase("ru"))) {
    options.push({ id: "city-simferopol", name: simferopol.name, slug: simferopol.slug, href: `/cities/${simferopol.slug}`, detail: "Городской прогноз погоды" });
  }
  return options.sort((a, b) => a.name.localeCompare(b.name, "ru"));
}
