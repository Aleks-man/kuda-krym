import {
  apiErrorSchema,
  departureLocationSearchQuerySchema,
  departureLocationSearchResponseSchema,
} from "@kuda-krym/contracts";

import { ApiGatewayError } from "../../../shared/api/api-gateway-error";
import { getApiGatewayHeaders } from "../../../shared/api/api-gateway-headers";

const defaultApiUrl = "http://127.0.0.1:4000";

export async function requestDepartureLocations(
  query: string,
  headers: HeadersInit,
) {
  const parsedQuery = departureLocationSearchQuerySchema.parse({ query });
  const url = new URL(
    "/api/departure-locations",
    process.env.API_URL ?? defaultApiUrl,
  );
  url.searchParams.set("query", parsedQuery.query);

  const response = await fetch(url, {
    headers,
    cache: "no-store",
  });
  const body: unknown = await response.json();

  if (!response.ok) {
    const error = apiErrorSchema.safeParse(body);
    throw new ApiGatewayError({
      message: error.success
        ? error.data.error.message
        : "Сервис поиска населённых пунктов недоступен",
      status: response.status,
      code: error.success ? error.data.error.code : "UPSTREAM_ERROR",
      headers: getApiGatewayHeaders(response.headers),
    });
  }

  return departureLocationSearchResponseSchema.parse(body);
}
