import {
  recommendationRequestSchema,
  recommendationResponseSchema,
} from "@kuda-krym/contracts";
import { Router } from "express";

import { HttpError } from "../../shared/http/http-error.js";
import { UnsupportedRecommendationDateError } from "./context/recommendation-context.error.js";
import { mapRecommendationResponse } from "./recommendation-response.mapper.js";
import type { RecommendationService } from "./recommendation.service.js";

export function createRecommendationRouter(
  service: Pick<RecommendationService, "calculate">,
): Router {
  const router = Router();

  router.post("/", async (request, response) => {
    const parsedRequest = recommendationRequestSchema.safeParse(request.body);

    if (!parsedRequest.success) {
      throw new HttpError({
        status: 400,
        code: "INVALID_RECOMMENDATION_REQUEST",
        message: "Некорректные параметры подбора пляжа",
      });
    }

    try {
      const calculation = await service.calculate(parsedRequest.data);
      response
        .status(200)
        .json(
          recommendationResponseSchema.parse(
            mapRecommendationResponse(calculation),
          ),
        );
    } catch (error) {
      if (!(error instanceof UnsupportedRecommendationDateError)) throw error;

      throw new HttpError({
        status: 400,
        code: "UNSUPPORTED_RECOMMENDATION_DATE",
        message: "Подбор доступен только на сегодня или завтра",
        cause: error,
      });
    }
  });

  return router;
}
