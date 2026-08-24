import {
  apiErrorSchema,
  recommendationResponseSchema,
  type RecommendationRequest,
} from "@kuda-krym/contracts";

export async function submitRecommendations(request: RecommendationRequest) {
  const response = await fetch("/api/recommendations", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(request),
  });
  const body: unknown = await response.json();

  if (!response.ok) {
    const error = apiErrorSchema.safeParse(body);
    throw new Error(
      error.success ? error.data.error.message : "Не удалось подобрать пляжи",
    );
  }

  return recommendationResponseSchema.parse(body);
}
