import type { RecommendationRequest } from "@kuda-krym/contracts";

import { isInsideCrimeaSearchArea } from "../../departure-locations/crimea-search-area.js";
import type { RecommendationOrigin } from "./recommendation-context.js";
import { UnsupportedRecommendationOriginError } from "./recommendation-context.error.js";
import { recommendationOrigins } from "./recommendation-origin.config.js";

export function normalizeRecommendationOrigin(
  origin: RecommendationRequest["origin"],
): RecommendationOrigin {
  if (typeof origin === "string") {
    return recommendationOrigins[origin];
  }

  if (!isInsideCrimeaSearchArea(origin.latitude, origin.longitude)) {
    throw new UnsupportedRecommendationOriginError(origin.id);
  }

  return {
    code: origin.id,
    name: origin.name,
    latitude: origin.latitude,
    longitude: origin.longitude,
  };
}
