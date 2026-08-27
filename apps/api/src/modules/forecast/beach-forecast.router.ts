import { beachForecastSchema } from "@kuda-krym/contracts";
import { Router } from "express";
import { z } from "zod";

import { HttpError } from "../../shared/http/http-error.js";
import type { BeachForecastService } from "./beach-forecast.service.js";

const paramsSchema = z.object({ beachId: z.uuid() });
const querySchema = z.object({ days: z.coerce.number().pipe(z.union([z.literal(1), z.literal(2)])).default(2) });

export function createBeachForecastRouter(service: BeachForecastService): Router {
  const router = Router();

  router.get("/:beachId", async (request, response) => {
    const params = paramsSchema.safeParse(request.params);
    const query = querySchema.safeParse(request.query);
    if (!params.success || !query.success) {
      throw new HttpError({
        status: 400,
        code: "INVALID_FORECAST_REQUEST",
        message: "Некорректные параметры прогноза",
      });
    }

    const forecast = await service.getForecast(params.data.beachId, query.data.days);
    if (!forecast) {
      throw new HttpError({
        status: 404,
        code: "BEACH_NOT_FOUND",
        message: "Пляж не найден",
      });
    }

    response.status(200).json(beachForecastSchema.parse(forecast));
  });

  return router;
}
