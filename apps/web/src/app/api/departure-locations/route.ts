import { departureLocationSearchQuerySchema } from "@kuda-krym/contracts";
import { NextResponse } from "next/server";

import { requestDepartureLocations } from "@/features/departure-locations/api/request-departure-locations";
import {
  createApiErrorResponse,
  createApiGatewayErrorResponse,
} from "@/shared/api/api-error-response";
import { ApiGatewayError } from "@/shared/api/api-gateway-error";
import { createApiProxyHeaders } from "@/shared/api/api-proxy-headers";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = departureLocationSearchQuerySchema.safeParse({
    query: url.searchParams.get("query"),
  });

  if (!query.success) {
    return createApiErrorResponse({
      code: "VALIDATION_ERROR",
      message: "Введите не менее двух символов для поиска",
      status: 400,
    });
  }

  try {
    return NextResponse.json(
      await requestDepartureLocations(
        query.data.query,
        createApiProxyHeaders(request.headers),
      ),
    );
  } catch (error) {
    if (error instanceof ApiGatewayError) {
      return createApiGatewayErrorResponse(error);
    }

    return createApiErrorResponse({
      code: "DEPARTURE_LOCATION_SEARCH_UNAVAILABLE",
      message: "Поиск населённых пунктов временно недоступен",
      status: 503,
    });
  }
}
