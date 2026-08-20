import type { HealthResponse } from "@kuda-krym/contracts";
import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/", (_request, response) => {
  const responseBody: HealthResponse = { status: "ok" };

  response.status(200).json(responseBody);
});

