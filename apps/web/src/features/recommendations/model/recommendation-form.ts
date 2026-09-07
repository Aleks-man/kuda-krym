import {
  recommendationRequestSchema,
  type RecommendationRequest,
} from "@kuda-krym/contracts";
import {
  parseRelativeRecommendationDate,
  resolveRecommendationDate,
} from "./crimea-date";
import { parseRecommendationOrigin } from "./recommendation-origin";

export function createRecommendationRequest(
  formData: FormData,
): RecommendationRequest {
  const relativeDate = formData.get("date");

  return recommendationRequestSchema.parse({
    origin: parseRecommendationOrigin(formData.get("origin")),
    date: resolveRecommendationDate(
      parseRelativeRecommendationDate(relativeDate),
    ),
    time: formData.get("time"),
    priority: formData.get("priority"),
    maxTravelMinutes: Number(formData.get("maxTravelMinutes")),
  });
}
