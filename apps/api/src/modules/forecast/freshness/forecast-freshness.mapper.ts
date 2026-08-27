import type {
  ForecastFreshness,
  ForecastSourceFreshness,
} from "@kuda-krym/contracts";

import type { MarineForecast } from "../../marine/marine-forecast.js";
import type { WeatherForecast } from "../../weather/weather-forecast.js";
import { getDataFreshness } from "../../../shared/cache/cache-freshness.js";

export function mapForecastFreshness(
  weather: WeatherForecast,
  marine: MarineForecast,
  weatherModels: ForecastSourceFreshness | null,
): ForecastFreshness {
  const sources = {
    weather: getDataFreshness(weather),
    marine: getDataFreshness(marine),
    weatherModels,
  };
  const availableSources = [
    sources.weather,
    sources.marine,
    sources.weatherModels,
  ].filter((source): source is ForecastSourceFreshness => source !== null);

  return {
    status: availableSources.some(({ status }) => status === "STALE")
      ? "STALE"
      : "FRESH",
    sources,
  };
}
