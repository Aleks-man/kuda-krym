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
import { createHealthRouter } from "./modules/health/health.router.js";
import type { HealthService } from "./modules/health/health.service.js";
import { createRecommendationRouter } from "./modules/recommendations/recommendation.router.js";
import type { RecommendationService } from "./modules/recommendations/recommendation.service.js";
import { createRoutingRouter } from "./modules/routing/routing.router.js";
import type { RoutingService } from "./modules/routing/routing.service.js";
import { createWeatherModelComparisonRouter } from "./modules/weather/models/comparison/weather-model-comparison.router.js";
import type { WeatherModelComparisonService } from "./modules/weather/models/comparison/weather-model-comparison.service.js";
import { createErrorHandler } from "./shared/http/error-handler.js";
import { notFoundHandler } from "./shared/http/not-found-handler.js";
import {
  createRequestIdMiddleware,
  getRequestId,
} from "./shared/http/request-id.js";
import { createRequestLogger } from "./shared/http/request-logger.js";
import { createRateLimitMiddleware } from "./shared/http/rate-limit/rate-limit.middleware.js";
import { createRateLimitPolicies } from "./shared/http/rate-limit/rate-limit.policy.js";
import { ConsoleJsonLogger } from "./shared/logging/console-json.logger.js";
import type { Logger } from "./shared/logging/logger.js";

export type AppDependencies = Readonly<{
  healthService: Pick<HealthService, "getReadiness">;
  beachService: BeachService;
  coastalLocationService: Pick<
    CoastalLocationService,
    "listPublished" | "getPublishedBySlug"
  >;
  coastalForecastService: Pick<CoastalForecastService, "getForecast">;
  beachForecastService: BeachForecastService;
  recommendationService: Pick<RecommendationService, "calculate">;
  routingService: Pick<RoutingService, "calculateDrivingRoute">;
  weatherModelComparisonService: Pick<
    WeatherModelComparisonService,
    "compare"
  >;
}>;

export type CreateAppOptions = Readonly<{
  env: AppEnv;
  dependencies: AppDependencies;
  logger?: Logger;
}>;

export function createApp({
  env,
  dependencies,
  logger = new ConsoleJsonLogger(),
}: CreateAppOptions) {
  const app = express();

  app.disable("x-powered-by");
  app.use(createRequestIdMiddleware());
  app.use(createRequestLogger({ logger }));
  app.use(helmet());
  app.use(cors({ origin: env.WEB_ORIGIN }));
  app.use(express.json());

  const rateLimitPolicies = createRateLimitPolicies(env);
  const globalRateLimit = createRateLimitMiddleware(rateLimitPolicies.global);
  const expensiveRateLimit = createRateLimitMiddleware(
    rateLimitPolicies.expensive,
  );

  app.use("/api/health", createHealthRouter(dependencies.healthService));
  app.use("/api", globalRateLimit);
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
  app.use(
    "/api/routes",
    expensiveRateLimit,
    createRoutingRouter(dependencies.routingService),
  );
  app.use(
    "/api/weather",
    createWeatherModelComparisonRouter(
      dependencies.weatherModelComparisonService,
    ),
  );
  app.use(
    "/api/recommendations",
    expensiveRateLimit,
    createRecommendationRouter(dependencies.recommendationService),
  );
  app.use(notFoundHandler);
  app.use(
    createErrorHandler({
      onUnexpectedError: (error, request, response) => {
        logger.error("http.request.failed", {
          requestId: getRequestId(response),
          method: request.method,
          path: request.path,
          error,
        });
      },
    }),
  );

  return app;
}

