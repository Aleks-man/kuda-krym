import { apiErrorSchema, beachForecastSchema } from "@kuda-krym/contracts";
import { Router } from "express";
import { z } from "zod";

import type { BeachForecastService } from "./beach-forecast.service.js";

const paramsSchema = z.object({ beachId: z.uuid() });
const querySchema = z.object({ days: z.coerce.number().pipe(z.union([z.literal(1), z.literal(2)])).default(2) });

export function createBeachForecastRouter(service: BeachForecastService): Router {
  const router = Router();

  router.get("/:beachId", async (request, response) => {
    const params = paramsSchema.safeParse(request.params);
    const query = querySchema.safeParse(request.query);
    if (!params.success || !query.success) {
      response.status(400).json(
        apiErrorSchema.parse({
          error: { code: "INVALID_FORECAST_REQUEST", message: "Некорректные параметры прогноза" },
        }),
      );
      return;
    }

    const forecast = await service.getForecast(params.data.beachId, query.data.days);
    if (!forecast) {
      response.status(404).json(
        apiErrorSchema.parse({
          error: { code: "BEACH_NOT_FOUND", message: "Пляж не найден" },
        }),
      );
      return;
    }

    response.status(200).json(beachForecastSchema.parse(forecast));
  });

  return router;
}
