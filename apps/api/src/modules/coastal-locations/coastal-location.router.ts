import {
  coastalLocationBeachesResponseSchema,
  coastalLocationListResponseSchema,
  coastalLocationSchema,
} from "@kuda-krym/contracts";
import { Router } from "express";

import { HttpError } from "../../shared/http/http-error.js";
import type { CoastalLocationBeachesService } from "./coastal-location-beaches.service.js";
import type { CoastalLocationService } from "./coastal-location.service.js";

export function createCoastalLocationRouter(
  dependencies: Readonly<{
    beachesService: Pick<CoastalLocationBeachesService, "listPublished">;
    locationService: Pick<
      CoastalLocationService,
      "listPublished" | "getPublishedBySlug"
    >;
  }>,
): Router {
  const router = Router();

  router.get("/", async (_request, response) => {
    const result = await dependencies.locationService.listPublished();
    response.status(200).json(coastalLocationListResponseSchema.parse(result));
  });

  router.get("/:slug/beaches", async (request, response) => {
    const result = request.params.slug
      ? await dependencies.beachesService.listPublished(request.params.slug)
      : null;

    if (!result) {
      throw createLocationNotFoundError();
    }

    response
      .status(200)
      .json(coastalLocationBeachesResponseSchema.parse(result));
  });

  router.get("/:slug", async (request, response) => {
    const location = request.params.slug
      ? await dependencies.locationService.getPublishedBySlug(request.params.slug)
      : null;

    if (!location) {
      throw createLocationNotFoundError();
    }

    response.status(200).json(coastalLocationSchema.parse(location));
  });

  return router;
}

function createLocationNotFoundError() {
  return new HttpError({
    status: 404,
    code: "COASTAL_LOCATION_NOT_FOUND",
    message: "Прибрежная зона не найдена",
  });
}
