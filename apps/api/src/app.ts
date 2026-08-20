import cors from "cors";
import express from "express";
import helmet from "helmet";

import type { AppEnv } from "./config/env.js";
import { createBeachRouter } from "./modules/beaches/beach.router.js";
import type { BeachService } from "./modules/beaches/beach.service.js";
import { createBeachForecastRouter } from "./modules/forecast/beach-forecast.router.js";
import type { BeachForecastService } from "./modules/forecast/beach-forecast.service.js";
import { healthRouter } from "./modules/health/health.router.js";
import { recommendationRouter } from "./modules/recommendations/recommendation.router.js";

export type AppDependencies = Readonly<{
  beachService: BeachService;
  beachForecastService: BeachForecastService;
}>;

export type CreateAppOptions = Readonly<{
  env: AppEnv;
  dependencies: AppDependencies;
}>;

export function createApp({ env, dependencies }: CreateAppOptions) {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(cors({ origin: env.WEB_ORIGIN }));
  app.use(express.json());

  app.use("/api/health", healthRouter);
  app.use("/api/beaches", createBeachRouter(dependencies.beachService));
  app.use(
    "/api/forecast",
    createBeachForecastRouter(dependencies.beachForecastService),
  );
  app.use("/api/recommendations", recommendationRouter);

  return app;
}

