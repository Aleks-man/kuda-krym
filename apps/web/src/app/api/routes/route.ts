import { routeRequestSchema } from "@kuda-krym/contracts";
import { NextResponse } from "next/server";
import { requestRoute } from "@/features/routing/api/request-route";
import { ApiGatewayError } from "@/shared/api/api-gateway-error";
import { createApiProxyHeaders } from "@/shared/api/api-proxy-headers";
import {
  createApiErrorResponse,
  createApiGatewayErrorResponse,
} from "@/shared/api/api-error-response";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = routeRequestSchema.safeParse(body);

    if (!parsed.success) {
      return createApiErrorResponse({
        code: "VALIDATION_ERROR",
        message: "Проверьте параметры маршрута",
        status: 400,
      });
    }

    return NextResponse.json(
      await requestRoute(parsed.data, createApiProxyHeaders(request.headers)),
    );
  } catch (error) {
    if (error instanceof ApiGatewayError) {
      return createApiGatewayErrorResponse(error);
    }

    return createApiErrorResponse({
      code: "ROUTING_UNAVAILABLE",
      message: "Сервис маршрутов временно недоступен",
      status: 503,
    });
  }
}
