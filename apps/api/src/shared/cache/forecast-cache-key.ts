export type ForecastCacheSource = "weather" | "marine" | "weather-models";

export type ForecastCacheCoordinates = Readonly<{
  latitude: number;
  longitude: number;
}>;

export type ForecastCacheKey =
  `forecast:${ForecastCacheSource}:${string}:days:${number}`;

const coordinatePrecision = 4;

export function createForecastCacheKey(
  source: ForecastCacheSource,
  coordinates: ForecastCacheCoordinates,
  days: number,
): ForecastCacheKey {
  const latitude = normalizeCoordinate(coordinates.latitude);
  const longitude = normalizeCoordinate(coordinates.longitude);

  return `forecast:${source}:${latitude},${longitude}:days:${days}`;
}

function normalizeCoordinate(value: number): string {
  return value.toFixed(coordinatePrecision);
}
