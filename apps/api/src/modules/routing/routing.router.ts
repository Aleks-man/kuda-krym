import {
  apiErrorSchema,
  routeRequestSchema,
  routeResponseSchema,
} from "@kuda-krym/contracts";
import { Router } from "express";
import { mapRouteResponse } from "./route-response.mapper.js";
import type { RoutingService } from "./routing.service.js";

export function createRoutingRouter(
  service: Pick<RoutingService, "calculateDrivingRoute">,
): Router {
  const router = Router();

  router.post("/", async (request, response) => {
    const parsedRequest = routeRequestSchema.safeParse(request.body);

    if (!parsedRequest.success) {
      response.status(400).json(
        apiErrorSchema.parse({
          error: {
            code: "INVALID_ROUTE_REQUEST",
            message: "Некорректные параметры маршрута",
          },
        }),
      );
      return;
    }

    try {
      const route = await service.calculateDrivingRoute(
        parsedRequest.data.origin,
        parsedRequest.data.beachId,
      );

      if (!route) {
        response.status(404).json(
          apiErrorSchema.parse({
            error: { code: "BEACH_NOT_FOUND", message: "Пляж не найден" },
          }),
        );
        return;
      }

      response.status(200).json(routeResponseSchema.parse(mapRouteResponse(route)));
    } catch {
      response.status(502).json(
        apiErrorSchema.parse({
          error: {
            code: "ROUTING_PROVIDER_UNAVAILABLE",
            message: "Не удалось построить маршрут",
          },
        }),
      );
    }
  });

  return router;
}
