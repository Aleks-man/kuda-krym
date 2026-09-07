import type { RecommendationRequest } from "@kuda-krym/contracts";

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
  const tomorrow = getCrimeaDate(new Date(now.getTime() + dayMilliseconds));
  const dayAfterTomorrow = getCrimeaDate(
    new Date(now.getTime() + 2 * dayMilliseconds),
  );

  if (
    request.date !== today &&
    request.date !== tomorrow &&
    request.date !== dayAfterTomorrow
  ) {
    throw new UnsupportedRecommendationDateError(request.date);
  }

  const window = visitWindows[request.time];

  return {
    origin: normalizeRecommendationOrigin(request.origin),
    date: request.date,
    forecastDays:
      request.date === today ? 1 : request.date === tomorrow ? 2 : 3,
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
