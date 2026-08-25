import cors from "cors";
import express from "express";
import helmet from "helmet";

import type { AppEnv } from "./config/env.js";
import { createBeachRouter } from "./modules/beaches/beach.router.js";
import type { BeachService } from "./modules/beaches/beach.service.js";
import { createCoastalForecastRouter } from "./modules/coastal-forecast/coastal-forecast.router.js";
import type { CoastalForecastService } from "./modules/coastal-forecast/coastal-forecast.service.js";
import { createCoastalLocationRouter } from "./modules/coastal-locations/coastal-location.router.js";
import type { CoastalLocationService } from "./modules/coastal-locations/coastal-location.service.js";
import { createBeachForecastRouter } from "./modules/forecast/beach-forecast.router.js";
import type { BeachForecastService } from "./modules/forecast/beach-forecast.service.js";
import { healthRouter } from "./modules/health/health.router.js";
import { createRecommendationRouter } from "./modules/recommendations/recommendation.router.js";
import type { RecommendationService } from "./modules/recommendations/recommendation.service.js";
import { createRoutingRouter } from "./modules/routing/routing.router.js";
import type { RoutingService } from "./modules/routing/routing.service.js";

export type AppDependencies = Readonly<{
  beachService: BeachService;
  coastalLocationService: Pick<
    CoastalLocationService,
    "listPublished" | "getPublishedBySlug"
  >;
  coastalForecastService: Pick<CoastalForecastService, "getForecast">;
  beachForecastService: BeachForecastService;
  recommendationService: Pick<RecommendationService, "calculate">;
  routingService: Pick<RoutingService, "calculateDrivingRoute">;
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
    "/api/coastal-locations",
    createCoastalForecastRouter(dependencies.coastalForecastService),
  );
  app.use(
    "/api/coastal-locations",
    createCoastalLocationRouter(dependencies.coastalLocationService),
  );
  app.use(
    "/api/forecast",
    createBeachForecastRouter(dependencies.beachForecastService),
  );
  app.use("/api/routes", createRoutingRouter(dependencies.routingService));
  app.use(
    "/api/recommendations",
    createRecommendationRouter(dependencies.recommendationService),
  );

  return app;
}

