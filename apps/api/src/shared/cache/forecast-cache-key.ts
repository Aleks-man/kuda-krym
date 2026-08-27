export type ForecastCacheSource = "weather" | "marine" | "weather-models";

export type ForecastCacheCoordinates = Readonly<{
  latitude: number;
  longitude: number;
}>;

export type ForecastCacheKey =
  `forecast:${ForecastCacheSource}:${string}:days:${number}`;

type WeatherModelCacheKey =
  `forecast:weather-models:${string}:${string}:days:${number}`;

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

export function createWeatherModelCacheKey(
  model: string,
  coordinates: ForecastCacheCoordinates,
  days: number,
): WeatherModelCacheKey {
  const latitude = normalizeCoordinate(coordinates.latitude);
  const longitude = normalizeCoordinate(coordinates.longitude);

  return `forecast:weather-models:${model}:${latitude},${longitude}:days:${days}`;
}

function normalizeCoordinate(value: number): string {
  return value.toFixed(coordinatePrecision);
}
