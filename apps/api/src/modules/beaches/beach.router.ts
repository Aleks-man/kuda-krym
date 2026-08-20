import { beachListResponseSchema } from "@kuda-krym/contracts";
import { Router } from "express";

import type { BeachService } from "./beach.service.js";

export function createBeachRouter(beachService: BeachService): Router {
  const router = Router();

  router.get("/", async (_request, response) => {
    const result = await beachService.listPublished();

    response.status(200).json(beachListResponseSchema.parse(result));
  });

  return router;
}

