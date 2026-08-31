import {
  apiErrorSchema,
  routeRequestSchema,
  routeResponseSchema,
  type RouteRequest,
} from "@kuda-krym/contracts";
import { ApiGatewayError } from "@/shared/api/api-gateway-error";

const defaultApiUrl = "http://127.0.0.1:4000";

export async function requestRoute(request: RouteRequest, headers: HeadersInit) {
  const payload = routeRequestSchema.parse(request);
  const apiUrl = process.env.API_URL ?? defaultApiUrl;
  const response = await fetch(`${apiUrl}/api/routes`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const body: unknown = await response.json();

  if (!response.ok) {
    const error = apiErrorSchema.safeParse(body);
    throw new ApiGatewayError(
      error.success ? error.data.error.message : "Сервис маршрутов недоступен",
      response.status,
      error.success ? error.data.error.code : "UPSTREAM_ERROR",
    );
  }

  return routeResponseSchema.parse(body);
}
