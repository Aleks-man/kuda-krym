import {
  apiErrorSchema,
  recommendationRequestSchema,
} from "@kuda-krym/contracts";
import { Router } from "express";

export const recommendationRouter = Router();

recommendationRouter.post("/", (request, response) => {
  const parsedRequest = recommendationRequestSchema.safeParse(request.body);

  if (!parsedRequest.success) {
    response.status(400).json(
      apiErrorSchema.parse({
        error: {
          code: "INVALID_RECOMMENDATION_REQUEST",
          message: "Некорректные параметры подбора пляжа",
        },
      }),
    );
    return;
  }

  response.status(501).json(
    apiErrorSchema.parse({
      error: {
        code: "RECOMMENDATIONS_NOT_READY",
        message: "Расчёт рекомендаций пока не подключён",
      },
    }),
  );
});
