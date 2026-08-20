import {
  apiErrorSchema,
  beachDetailSchema,
  beachListResponseSchema,
} from "@kuda-krym/contracts";
import { Router } from "express";

import type { BeachService } from "./beach.service.js";

export function createBeachRouter(beachService: BeachService): Router {
  const router = Router();

  router.get("/", async (_request, response) => {
    const result = await beachService.listPublished();

    response.status(200).json(beachListResponseSchema.parse(result));
  });

  router.get("/:slug", async (request, response) => {
    const slug = request.params.slug;

    if (!slug) {
      response.status(404).json(
        apiErrorSchema.parse({
          error: { code: "BEACH_NOT_FOUND", message: "Пляж не найден" },
        }),
      );
      return;
    }

    const beach = await beachService.getPublishedBySlug(slug);

    if (!beach) {
      response.status(404).json(
        apiErrorSchema.parse({
          error: {
            code: "BEACH_NOT_FOUND",
            message: "Пляж не найден",
          },
        }),
      );
      return;
    }

    response.status(200).json(beachDetailSchema.parse(beach));
  });

  return router;
}

