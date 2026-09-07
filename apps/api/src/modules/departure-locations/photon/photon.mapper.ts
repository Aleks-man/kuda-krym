import type { DepartureLocation } from "@kuda-krym/contracts";

import { isInsideCrimeaSearchArea } from "../crimea-search-area.js";
import type { PhotonFeature } from "./photon-response.schema.js";

const crimeaRegionPattern = /крым|крим|crimea|севастопол|sevastopol/i;
const settlementPlaceValues = new Set([
  "city",
  "town",
  "village",
  "hamlet",
  "isolated_dwelling",
]);

export function mapPhotonFeatures(
  features: readonly PhotonFeature[],
): DepartureLocation[] {
  return features
    .filter(isCrimeaFeature)
    .map(mapPhotonFeature)
    .slice(0, 8);
}

function isCrimeaFeature(feature: PhotonFeature): boolean {
  const [longitude, latitude] = feature.geometry.coordinates;
  const region = [
    feature.properties.state,
    feature.properties.county,
    feature.properties.country,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    feature.properties.osm_key === "place" &&
    settlementPlaceValues.has(feature.properties.osm_value ?? "") &&
    isInsideCrimeaSearchArea(latitude, longitude) &&
    crimeaRegionPattern.test(region)
  );
}

function mapPhotonFeature(feature: PhotonFeature): DepartureLocation {
  const { properties } = feature;
  const [longitude, latitude] = feature.geometry.coordinates;
  const context = [properties.city, properties.county]
    .filter(
      (part, index, parts): part is string =>
        Boolean(part) && part !== properties.name && parts.indexOf(part) === index,
    )
    .join(" · ");

  return {
    id: `osm:${properties.osm_type}:${properties.osm_id}`,
    name: properties.name,
    context,
    latitude,
    longitude,
  };
}
