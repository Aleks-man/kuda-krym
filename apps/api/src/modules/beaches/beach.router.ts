import {
  beachCatalogFilterOptionsSchema,
  beachCatalogQuerySchema,
  beachDetailSchema,
  beachListResponseSchema,
} from "@kuda-krym/contracts";
import { Router } from "express";

import { HttpError } from "../../shared/http/http-error.js";
import type { BeachService } from "./beach.service.js";

export function createBeachRouter(beachService: BeachService): Router {
  const router = Router();

  router.get("/", async (request, response) => {
    const query = beachCatalogQuerySchema.safeParse(request.query);
    if (!query.success) {
      throw new HttpError({
        status: 400,
        code: "INVALID_BEACH_CATALOG_QUERY",
        message: "Некорректные параметры каталога пляжей",
      });
    }

    const result = await beachService.listPublished(query.data);

    response.status(200).json(beachListResponseSchema.parse(result));
  });

  router.get("/filter-options", async (_request, response) => {
    const options = await beachService.getFilterOptions();
    response
      .status(200)
      .json(beachCatalogFilterOptionsSchema.parse(options));
  });

  router.get("/:slug", async (request, response) => {
    const slug = request.params.slug;

    if (!slug) throw beachNotFoundError();

    const beach = await beachService.getPublishedBySlug(slug);

    if (!beach) throw beachNotFoundError();

    response.status(200).json(beachDetailSchema.parse(beach));
  });

  return router;
}

function beachNotFoundError(): HttpError {
  return new HttpError({
    status: 404,
    code: "BEACH_NOT_FOUND",
    message: "Пляж не найден",
  });
}

