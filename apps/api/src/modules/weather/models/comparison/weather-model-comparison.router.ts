import { weatherModelComparisonResponseSchema } from "@kuda-krym/contracts";
import { Router } from "express";
import { z } from "zod";

import { HttpError } from "../../../../shared/http/http-error.js";
import type { WeatherModelComparisonService } from "./weather-model-comparison.service.js";

const querySchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  days: z.coerce
    .number()
    .pipe(z.union([z.literal(1), z.literal(2)]))
    .default(2),
});

export function createWeatherModelComparisonRouter(
  service: Pick<WeatherModelComparisonService, "compare">,
): Router {
  const router = Router();

  router.get("/model-comparison", async (request, response) => {
    const query = querySchema.safeParse(request.query);
    if (!query.success) {
      throw new HttpError({
        status: 400,
        code: "INVALID_WEATHER_MODEL_COMPARISON_REQUEST",
        message: "Некорректные параметры сравнения моделей",
      });
    }

    const comparison = await service.compare(
      {
        latitude: query.data.latitude,
        longitude: query.data.longitude,
      },
      query.data.days,
    );
    response
      .status(200)
      .json(weatherModelComparisonResponseSchema.parse(comparison));
  });

  return router;
}
