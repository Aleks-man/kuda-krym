import type { ForecastSourceFreshness } from "@kuda-krym/contracts";

import type { ForecastLocation } from "../weather/weather-forecast.js";
import type { WeatherModelComparisonService } from "../weather/models/comparison/weather-model-comparison.service.js";

export type ModelAgreementHour = Readonly<{
  time: string;
  score: number | null;
}>;

export type WeatherModelAgreementLoad = Readonly<{
  hours: ModelAgreementHour[];
  freshness: ForecastSourceFreshness | null;
}>;

export async function loadWeatherModelAgreements(
  service: Pick<WeatherModelComparisonService, "compare">,
  location: ForecastLocation,
  days: 1 | 2,
): Promise<WeatherModelAgreementLoad> {
  try {
    const comparison = await service.compare(location, days);
    return {
      hours: comparison.hourly.map((hour) => ({
        time: hour.time,
        score: hour.agreement.score,
      })),
      freshness: comparison.freshness,
    };
  } catch {
    return { hours: [], freshness: null };
  }
}
