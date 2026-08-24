import {
  apiErrorSchema,
  recommendationRequestSchema,
  recommendationResponseSchema,
  type RecommendationRequest,
} from "@kuda-krym/contracts";

const defaultApiUrl = "http://127.0.0.1:4000";

export class RecommendationGatewayError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string,
  ) {
    super(message);
  }
}

export async function requestRecommendations(request: RecommendationRequest) {
  const payload = recommendationRequestSchema.parse(request);
  const apiUrl = process.env.API_URL ?? defaultApiUrl;
  const response = await fetch(`${apiUrl}/api/recommendations`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const body: unknown = await response.json();

  if (!response.ok) {
    const error = apiErrorSchema.safeParse(body);
    throw new RecommendationGatewayError(
      error.success ? error.data.error.message : "Сервис рекомендаций недоступен",
      response.status,
      error.success ? error.data.error.code : "UPSTREAM_ERROR",
    );
  }

  return recommendationResponseSchema.parse(body);
}
