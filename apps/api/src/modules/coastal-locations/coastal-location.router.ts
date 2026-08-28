import {
  coastalLocationListResponseSchema,
  coastalLocationSchema,
} from "@kuda-krym/contracts";
import { Router } from "express";

import { HttpError } from "../../shared/http/http-error.js";
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
      throw new HttpError({
        status: 404,
        code: "COASTAL_LOCATION_NOT_FOUND",
        message: "Прибрежная зона не найдена",
      });
    }

    response.status(200).json(coastalLocationSchema.parse(location));
  });

  return router;
}
