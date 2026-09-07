import {
  recommendationRequestSchema,
  type RecommendationRequest,
} from "@kuda-krym/contracts";
import {
  parseRelativeRecommendationDate,
  resolveRecommendationDate,
} from "./crimea-date";

export function createRecommendationRequest(
  formData: FormData,
): RecommendationRequest {
  const relativeDate = formData.get("date");

  return recommendationRequestSchema.parse({
    origin: formData.get("origin"),
    date: resolveRecommendationDate(
      parseRelativeRecommendationDate(relativeDate),
    ),
    time: formData.get("time"),
    surface: formData.get("surface"),
    priority: formData.get("priority"),
    maxTravelMinutes: Number(formData.get("maxTravelMinutes")),
  });
}
