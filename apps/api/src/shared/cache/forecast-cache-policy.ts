import type { ForecastCacheSource } from "./forecast-cache-key.js";

const minutes = 60;
const hours = 60 * minutes;

export const forecastCacheTtlSeconds = {
  weather: 15 * minutes,
  marine: 30 * minutes,
  "weather-models": 15 * minutes,
} as const satisfies Record<ForecastCacheSource, number>;

export const forecastCacheRetentionSeconds = {
  weather: 6 * hours,
  marine: 6 * hours,
  "weather-models": 6 * hours,
} as const satisfies Record<ForecastCacheSource, number>;
