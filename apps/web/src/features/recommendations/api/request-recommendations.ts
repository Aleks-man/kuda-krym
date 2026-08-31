import {
  apiErrorSchema,
  recommendationRequestSchema,
  recommendationResponseSchema,
  type RecommendationRequest,
} from "@kuda-krym/contracts";
import { ApiGatewayError } from "@/shared/api/api-gateway-error";
import { getApiGatewayHeaders } from "@/shared/api/api-gateway-headers";

const defaultApiUrl = "http://127.0.0.1:4000";

export async function requestRecommendations(
  request: RecommendationRequest,
  headers: HeadersInit,
) {
  const payload = recommendationRequestSchema.parse(request);
  const apiUrl = process.env.API_URL ?? defaultApiUrl;
  const response = await fetch(`${apiUrl}/api/recommendations`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const body: unknown = await response.json();

  if (!response.ok) {
    const error = apiErrorSchema.safeParse(body);
    throw new ApiGatewayError({
      message: error.success ? error.data.error.message : "Сервис рекомендаций недоступен",
      status: response.status,
      code: error.success ? error.data.error.code : "UPSTREAM_ERROR",
      headers: getApiGatewayHeaders(response.headers),
    });
  }

  return recommendationResponseSchema.parse(body);
}
