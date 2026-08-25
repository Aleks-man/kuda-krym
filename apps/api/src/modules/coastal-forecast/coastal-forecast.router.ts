import { apiErrorSchema, coastalForecastSchema } from "@kuda-krym/contracts";
import { Router } from "express";
import { z } from "zod";

import type { CoastalForecastService } from "./coastal-forecast.service.js";

const paramsSchema = z.object({ slug: z.string().trim().min(1) });
const querySchema = z.object({
  days: z.coerce
    .number()
    .pipe(z.union([z.literal(1), z.literal(2)]))
    .default(2),
});

export function createCoastalForecastRouter(
  service: Pick<CoastalForecastService, "getForecast">,
): Router {
  const router = Router();

  router.get("/:slug/forecast", async (request, response) => {
    const params = paramsSchema.safeParse(request.params);
    const query = querySchema.safeParse(request.query);

    if (!params.success || !query.success) {
      response.status(400).json(
        apiErrorSchema.parse({
          error: {
            code: "INVALID_COASTAL_FORECAST_REQUEST",
            message: "Некорректные параметры прогноза",
          },
        }),
      );
      return;
    }

    const forecast = await service.getForecast(
      params.data.slug,
      query.data.days,
    );

    if (!forecast) {
      response.status(404).json(
        apiErrorSchema.parse({
          error: {
            code: "COASTAL_LOCATION_NOT_FOUND",
            message: "Прибрежная зона не найдена",
          },
        }),
      );
      return;
    }

    response.status(200).json(coastalForecastSchema.parse(forecast));
  });

  return router;
}
