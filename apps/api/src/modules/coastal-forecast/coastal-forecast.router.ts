import { coastalForecastSchema } from "@kuda-krym/contracts";
import { Router } from "express";
import { z } from "zod";

import { HttpError } from "../../shared/http/http-error.js";
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
      throw new HttpError({
        status: 400,
        code: "INVALID_COASTAL_FORECAST_REQUEST",
        message: "Некорректные параметры прогноза",
      });
    }

    const forecast = await service.getForecast(
      params.data.slug,
      query.data.days,
    );

    if (!forecast) {
      throw new HttpError({
        status: 404,
        code: "COASTAL_LOCATION_NOT_FOUND",
        message: "Прибрежная зона не найдена",
      });
    }

    response.status(200).json(coastalForecastSchema.parse(forecast));
  });

  return router;
}
