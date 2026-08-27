import { beachDetailSchema, beachListResponseSchema } from "@kuda-krym/contracts";
import { Router } from "express";

import { HttpError } from "../../shared/http/http-error.js";
import type { BeachService } from "./beach.service.js";

export function createBeachRouter(beachService: BeachService): Router {
  const router = Router();

  router.get("/", async (_request, response) => {
    const result = await beachService.listPublished();

    response.status(200).json(beachListResponseSchema.parse(result));
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

