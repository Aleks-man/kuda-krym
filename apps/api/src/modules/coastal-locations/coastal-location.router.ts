import {
  apiErrorSchema,
  coastalLocationListResponseSchema,
  coastalLocationSchema,
} from "@kuda-krym/contracts";
import { Router } from "express";
import type { CoastalLocationService } from "./coastal-location.service.js";

export function createCoastalLocationRouter(
  service: Pick<CoastalLocationService, "listPublished" | "getPublishedBySlug">,
): Router {
  const router = Router();

  router.get("/", async (_request, response) => {
    const result = await service.listPublished();
    response.status(200).json(coastalLocationListResponseSchema.parse(result));
  });

  router.get("/:slug", async (request, response) => {
    const location = request.params.slug
      ? await service.getPublishedBySlug(request.params.slug)
      : null;

    if (!location) {
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

    response.status(200).json(coastalLocationSchema.parse(location));
  });

  return router;
}
