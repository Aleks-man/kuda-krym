import {
  recommendationRequestSchema,
  type RecommendationRequest,
} from "@kuda-krym/contracts";
import { resolveRecommendationDate } from "./crimea-date";

export function createRecommendationRequest(
  formData: FormData,
): RecommendationRequest {
  const relativeDate = formData.get("date");

  return recommendationRequestSchema.parse({
    origin: formData.get("origin"),
    date: resolveRecommendationDate(
      relativeDate === "tomorrow" ? "tomorrow" : "today",
    ),
    time: formData.get("time"),
    company: formData.get("company"),
    surface: formData.get("surface"),
    priority: formData.get("priority"),
  });
}
