import { routeRequestSchema, routeResponseSchema } from "@kuda-krym/contracts";
import { Router } from "express";

import { HttpError } from "../../shared/http/http-error.js";
import { mapRouteResponse } from "./route-response.mapper.js";
import type { RoutingService } from "./routing.service.js";

export function createRoutingRouter(
  service: Pick<RoutingService, "calculateDrivingRoute">,
): Router {
  const router = Router();

  router.post("/", async (request, response) => {
    const parsedRequest = routeRequestSchema.safeParse(request.body);

    if (!parsedRequest.success) {
      throw new HttpError({
        status: 400,
        code: "INVALID_ROUTE_REQUEST",
        message: "Некорректные параметры маршрута",
      });
    }

    try {
      const route = await service.calculateDrivingRoute(
        parsedRequest.data.origin,
        parsedRequest.data.beachId,
      );

      if (!route) {
        throw new HttpError({
          status: 404,
          code: "BEACH_NOT_FOUND",
          message: "Пляж не найден",
        });
      }

      response.status(200).json(routeResponseSchema.parse(mapRouteResponse(route)));
    } catch (error) {
      if (error instanceof HttpError) throw error;

      throw new HttpError({
        status: 502,
        code: "ROUTING_PROVIDER_UNAVAILABLE",
        message: "Не удалось построить маршрут",
        cause: error,
      });
    }
  });

  return router;
}
