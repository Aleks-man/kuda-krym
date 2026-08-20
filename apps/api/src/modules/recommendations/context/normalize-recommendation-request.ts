import type { RecommendationRequest } from "@kuda-krym/contracts";

import type { RecommendationContext } from "./recommendation-context.js";
import { UnsupportedRecommendationDateError } from "./recommendation-context.error.js";
import { recommendationOrigins } from "./recommendation-origin.config.js";
import { visitWindows } from "./visit-window.config.js";

const crimeaOffsetMilliseconds = 3 * 60 * 60 * 1_000;
const dayMilliseconds = 24 * 60 * 60 * 1_000;

const companyMap = {
  alone: "ALONE",
  children: "WITH_CHILDREN",
  friends: "FRIENDS",
} as const;

const surfaceMap = {
  any: "ANY",
  sand: "SAND",
  pebble: "PEBBLE",
} as const;

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

  if (request.date !== today && request.date !== tomorrow) {
    throw new UnsupportedRecommendationDateError(request.date);
  }

  const window = visitWindows[request.time];

  return {
    origin: recommendationOrigins[request.origin],
    date: request.date,
    forecastDays: request.date === today ? 1 : 2,
    visitWindow: {
      startsAt: toUtc(request.date, window.startsAt),
      endsAt: toUtc(request.date, window.endsAt),
    },
    company: companyMap[request.company],
    preferredSurface: surfaceMap[request.surface],
    priority: priorityMap[request.priority],
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
