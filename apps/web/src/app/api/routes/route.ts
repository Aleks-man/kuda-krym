import { apiErrorSchema, routeRequestSchema } from "@kuda-krym/contracts";
import { NextResponse } from "next/server";
import { requestRoute } from "@/features/routing/api/request-route";
import { ApiGatewayError } from "@/shared/api/api-gateway-error";
import { createApiProxyHeaders } from "@/shared/api/api-proxy-headers";

function errorResponse(code: string, message: string, status: number) {
  return NextResponse.json(apiErrorSchema.parse({ error: { code, message } }), {
    status,
  });
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = routeRequestSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("VALIDATION_ERROR", "Проверьте параметры маршрута", 400);
    }

    return NextResponse.json(
      await requestRoute(parsed.data, createApiProxyHeaders(request.headers)),
    );
  } catch (error) {
    if (error instanceof ApiGatewayError) {
      const status = error.status >= 400 && error.status < 500 ? error.status : 502;
      return errorResponse(error.code, error.message, status);
    }

    return errorResponse(
      "ROUTING_UNAVAILABLE",
      "Сервис маршрутов временно недоступен",
      503,
    );
  }
}
