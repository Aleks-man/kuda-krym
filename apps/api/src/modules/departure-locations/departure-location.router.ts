import {
  departureLocationSearchQuerySchema,
  departureLocationSearchResponseSchema,
} from "@kuda-krym/contracts";
import { Router } from "express";

import { HttpError } from "../../shared/http/http-error.js";
import type { DepartureLocationProvider } from "./departure-location.provider.js";

export function createDepartureLocationRouter(
  provider: Pick<DepartureLocationProvider, "search">,
): Router {
  const router = Router();

  router.get("/", async (request, response) => {
    const query = departureLocationSearchQuerySchema.safeParse({
      query: request.query.query,
    });

    if (!query.success) {
      throw new HttpError({
        status: 400,
        code: "INVALID_DEPARTURE_LOCATION_QUERY",
        message: "Введите не менее двух символов для поиска",
      });
    }

    try {
      const locations = await provider.search(query.data.query);
      response.status(200).json(
        departureLocationSearchResponseSchema.parse({ data: locations }),
      );
    } catch (error) {
      throw new HttpError({
        status: 502,
        code: "LOCATION_PROVIDER_UNAVAILABLE",
        message: "Не удалось найти населённые пункты",
        cause: error,
      });
    }
  });

  return router;
}
