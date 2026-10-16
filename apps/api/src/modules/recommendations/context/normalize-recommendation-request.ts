import type { RecommendationRequest } from "@kuda-krym/contracts";

import { forecastDaysSchema, providerForecastDaysSchema } from "../../../shared/forecast/forecast-days.js";

import type { RecommendationContext } from "./recommendation-context.js";
import { UnsupportedRecommendationDateError } from "./recommendation-context.error.js";
import { normalizeRecommendationOrigin } from "./normalize-recommendation-origin.js";
import { visitWindows } from "./visit-window.config.js";

const crimeaOffsetMilliseconds = 3 * 60 * 60 * 1_000;
const dayMilliseconds = 24 * 60 * 60 * 1_000;

const priorityMap = {
  calm_sea: "CALM_SEA",
  warm_water: "WARM_WATER",
  comfort: "COMFORT",
} as const;

export function normalizeRecommendationRequest(
  request: RecommendationRequest,
  now = new Date(),
): RecommendationContext {
  const today = getCrimeaDate(now);
  const dayOffset = (Date.parse(request.date) - Date.parse(today)) / dayMilliseconds;
  const forecastDays = forecastDaysSchema.safeParse(dayOffset + 1);

  if (!forecastDays.success) {
    throw new UnsupportedRecommendationDateError(request.date);
  }

  const window = visitWindows[request.time];
  // Open-Meteo is requested in GMT, so forecast_days starts at UTC midnight.
  const utcToday = now.toISOString().slice(0, 10);
  const providerDays = providerForecastDaysSchema.parse(
    (Date.parse(request.date) - Date.parse(utcToday)) / dayMilliseconds + 1,
  );

  return {
    origin: normalizeRecommendationOrigin(request.origin),
    date: request.date,
    forecastDays: providerDays,
    visitWindow: {
      startsAt: toUtc(request.date, window.startsAt),
      endsAt: toUtc(request.date, window.endsAt),
    },
    priority: priorityMap[request.priority],
    maxTravelMinutes: request.maxTravelMinutes,
  };
}

function getCrimeaDate(date: Date): string {
  return new Date(date.getTime() + crimeaOffsetMilliseconds)
    .toISOString()
    .slice(0, 10);
}

function toUtc(date: string, time: string): string {
  return new Date(`${date}T${time}:00+03:00`).toISOString();
}
