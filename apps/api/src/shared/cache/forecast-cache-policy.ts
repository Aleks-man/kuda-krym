import type { ForecastCacheSource } from "./forecast-cache-key.js";

const minutes = 60;

export const forecastCacheTtlSeconds = {
  weather: 15 * minutes,
  marine: 30 * minutes,
  "weather-models": 15 * minutes,
} as const satisfies Record<ForecastCacheSource, number>;
