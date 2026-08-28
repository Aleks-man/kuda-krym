import {
  healthResponseSchema,
  readinessResponseSchema,
} from "@kuda-krym/contracts";
import { Router } from "express";

import type { HealthService } from "./health.service.js";

export function createHealthRouter(
  service: Pick<HealthService, "getReadiness">,
): Router {
  const router = Router();

  router.get(["/", "/live"], (_request, response) => {
    response.status(200).json(healthResponseSchema.parse({ status: "ok" }));
  });

  router.get("/ready", async (_request, response) => {
    const readiness = readinessResponseSchema.parse(
      await service.getReadiness(),
    );
    response.status(readiness.status === "ready" ? 200 : 503).json(readiness);
  });

  return router;
}

