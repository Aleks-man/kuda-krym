import type { ForecastSourceFreshness } from "@kuda-krym/contracts";

import { getDataFreshness } from "../../../../shared/cache/cache-freshness.js";
import type { ModelWeatherForecast } from "../model-weather-forecast.js";

export function summarizeWeatherModelFreshness(
  forecasts: readonly ModelWeatherForecast[],
): ForecastSourceFreshness | null {
  if (forecasts.length === 0) return null;

  const sources = forecasts.map(getDataFreshness);
  const oldestGeneratedAt = new Date(
    Math.min(...sources.map(({ generatedAt }) => Date.parse(generatedAt))),
  ).toISOString();

  return {
    status: sources.some(({ status }) => status === "STALE")
      ? "STALE"
      : "FRESH",
    generatedAt: oldestGeneratedAt,
  };
}
