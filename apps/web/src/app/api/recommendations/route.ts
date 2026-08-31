import { recommendationRequestSchema } from "@kuda-krym/contracts";
import { NextResponse } from "next/server";
import {
  requestRecommendations,
} from "@/features/recommendations/api/request-recommendations";
import { ApiGatewayError } from "@/shared/api/api-gateway-error";
import { createApiProxyHeaders } from "@/shared/api/api-proxy-headers";
import {
  createApiErrorResponse,
  createApiGatewayErrorResponse,
} from "@/shared/api/api-error-response";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = recommendationRequestSchema.safeParse(body);

    if (!parsed.success) {
      return createApiErrorResponse({
        code: "VALIDATION_ERROR",
        message: "Проверьте параметры подбора",
        status: 400,
      });
    }

    return NextResponse.json(
      await requestRecommendations(
        parsed.data,
        createApiProxyHeaders(request.headers),
      ),
    );
  } catch (error) {
    if (error instanceof ApiGatewayError) {
      return createApiGatewayErrorResponse(error);
    }

    return createApiErrorResponse({
      code: "RECOMMENDATIONS_UNAVAILABLE",
      message: "Сервис рекомендаций временно недоступен",
      status: 503,
    });
  }
}
