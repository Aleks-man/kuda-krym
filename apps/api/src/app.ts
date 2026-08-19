import cors from "cors";
import express from "express";
import helmet from "helmet";

import type { AppEnv } from "./config/env.js";
import { healthRouter } from "./modules/health/health.router.js";

export function createApp(env: AppEnv) {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(cors({ origin: env.WEB_ORIGIN }));
  app.use(express.json());

  app.use("/api/health", healthRouter);

  return app;
}

