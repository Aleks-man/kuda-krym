import {
  apiErrorSchema,
  recommendationRequestSchema,
} from "@kuda-krym/contracts";
import { NextResponse } from "next/server";
import {
  RecommendationGatewayError,
  requestRecommendations,
} from "@/features/recommendations/api/request-recommendations";

function errorResponse(code: string, message: string, status: number) {
  return NextResponse.json(apiErrorSchema.parse({ error: { code, message } }), {
    status,
  });
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = recommendationRequestSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("VALIDATION_ERROR", "Проверьте параметры подбора", 400);
    }

    return NextResponse.json(await requestRecommendations(parsed.data));
  } catch (error) {
    if (error instanceof RecommendationGatewayError) {
      const status = error.status >= 400 && error.status < 500 ? error.status : 502;
      return errorResponse(error.code, error.message, status);
    }

    return errorResponse(
      "RECOMMENDATIONS_UNAVAILABLE",
      "Сервис рекомендаций временно недоступен",
      503,
    );
  }
}
