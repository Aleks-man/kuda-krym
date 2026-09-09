import { cityForecastSchema } from "@kuda-krym/contracts";
import { Router } from "express";
import { z } from "zod";

import { forecastDaysSchema } from "../../shared/forecast/forecast-days.js";
import { HttpError } from "../../shared/http/http-error.js";
import type { CityForecastService } from "./city-forecast.service.js";

const paramsSchema = z.object({ slug: z.string().trim().min(1) });
const querySchema = z.object({
  days: z.coerce.number().pipe(forecastDaysSchema).default(3),
});

export function createCityForecastRouter(
  service: Pick<CityForecastService, "getForecast">,
): Router {
  const router = Router();
  router.get("/:slug/forecast", async (request, response) => {
    const params = paramsSchema.safeParse(request.params);
    const query = querySchema.safeParse(request.query);
    if (!params.success || !query.success) {
      throw new HttpError({ status: 400, code: "INVALID_CITY_FORECAST_REQUEST", message: "Некорректные параметры прогноза" });
    }
    const forecast = await service.getForecast(params.data.slug, query.data.days);
    if (!forecast) {
      throw new HttpError({ status: 404, code: "CITY_NOT_FOUND", message: "Город не найден" });
    }
    response.status(200).json(cityForecastSchema.parse(forecast));
  });
  return router;
}
