import type { ForecastLocation } from "../weather/weather-forecast.js";
import type { WeatherModelComparisonService } from "../weather/models/comparison/weather-model-comparison.service.js";

export type ModelAgreementHour = Readonly<{
  time: string;
  score: number | null;
}>;

export async function loadWeatherModelAgreements(
  service: Pick<WeatherModelComparisonService, "compare">,
  location: ForecastLocation,
  days: 1 | 2,
): Promise<ModelAgreementHour[]> {
  try {
    const comparison = await service.compare(location, days);
    return comparison.hourly.map((hour) => ({
      time: hour.time,
      score: hour.agreement.score,
    }));
  } catch {
    return [];
  }
}
