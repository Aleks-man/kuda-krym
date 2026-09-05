import "dotenv/config";

import { createPrismaClient } from "@kuda-krym/database";

import { createApp } from "./app.js";
import { parseEnv, requireDatabaseUrl } from "./config/env.js";
import { createRedisCacheClient } from "./shared/cache/redis-cache.client.js";
import { RedisCacheStore } from "./shared/cache/redis-cache.store.js";
import { InMemoryRequestCoalescer } from "./shared/async/request-coalescer.js";
import { PrismaBeachRepository } from "./modules/beaches/prisma-beach.repository.js";
import { BeachService } from "./modules/beaches/beach.service.js";
import { CoastalForecastService } from "./modules/coastal-forecast/coastal-forecast.service.js";
import { CoastalLocationService } from "./modules/coastal-locations/coastal-location.service.js";
import { CoastalLocationBeachesService } from "./modules/coastal-locations/coastal-location-beaches.service.js";
import { PrismaCoastalLocationRepository } from "./modules/coastal-locations/prisma-coastal-location.repository.js";
import { BeachForecastService } from "./modules/forecast/beach-forecast.service.js";
import { PrismaForecastBeachRepository } from "./modules/forecast/prisma-forecast-beach.repository.js";
import { HealthService } from "./modules/health/health.service.js";
import { PrismaDatabaseHealthProbe } from "./modules/health/prisma-database-health.probe.js";
import { OpenMeteoMarineClient } from "./modules/marine/open-meteo/open-meteo-marine.client.js";
import { CachedMarineForecastProvider } from "./modules/marine/cache/cached-marine-forecast.provider.js";
import { OpenMeteoWeatherClient } from "./modules/weather/open-meteo/open-meteo-weather.client.js";
import { CachedWeatherForecastProvider } from "./modules/weather/cache/cached-weather-forecast.provider.js";
import { WeatherModelBatchLoader } from "./modules/weather/models/comparison/weather-model-batch.loader.js";
import { WeatherModelComparisonService } from "./modules/weather/models/comparison/weather-model-comparison.service.js";
import { OpenMeteoModelWeatherClient } from "./modules/weather/models/open-meteo/open-meteo-model-weather.client.js";
import { CachedModelWeatherForecastProvider } from "./modules/weather/models/cache/cached-model-weather-forecast.provider.js";
import { RecommendationCandidateService } from "./modules/recommendations/candidates/recommendation-candidate.service.js";
import { PrismaRecommendationCandidateRepository } from "./modules/recommendations/candidates/prisma-recommendation-candidate.repository.js";
import { CandidateForecastLoader } from "./modules/recommendations/forecasts/candidate-forecast.loader.js";
import { RecommendationService } from "./modules/recommendations/recommendation.service.js";
import { CandidateRouteLoader } from "./modules/recommendations/routes/candidate-route.loader.js";
import { OsrmClient } from "./modules/routing/osrm/osrm.client.js";
import { CachedRoutingProvider } from "./modules/routing/cache/cached-routing.provider.js";
import { PrismaRoutingBeachRepository } from "./modules/routing/prisma-routing-beach.repository.js";
import { RoutingService } from "./modules/routing/routing.service.js";
import { closeHttpServer } from "./shared/lifecycle/close-http-server.js";
import { createGracefulShutdown } from "./shared/lifecycle/graceful-shutdown.js";
import { registerShutdownSignals } from "./shared/lifecycle/shutdown-signals.js";
import { ConsoleJsonLogger } from "./shared/logging/console-json.logger.js";
import { createRedisRateLimitStores } from "./shared/http/rate-limit/redis-rate-limit.store.js";

const env = parseEnv(process.env);
const logger = new ConsoleJsonLogger();
const prisma = createPrismaClient(requireDatabaseUrl(env));
const healthService = new HealthService(new PrismaDatabaseHealthProbe(prisma));
const beachRepository = new PrismaBeachRepository(prisma);
const beachService = new BeachService(beachRepository);
const coastalLocationRepository = new PrismaCoastalLocationRepository(prisma);
const coastalLocationService = new CoastalLocationService(coastalLocationRepository);
const coastalLocationBeachesService = new CoastalLocationBeachesService({
  beachRepository,
  coastalLocationRepository,
});
const redisClient = createRedisCacheClient(env.REDIS_URL, (error) => {
  logger.error("redis.client.error", { error });
});
const redisCache = new RedisCacheStore(redisClient);
const requestCoalescer = new InMemoryRequestCoalescer();
const redisConnected = await redisCache
  .connect()
  .then(() => true)
  .catch((error: unknown) => {
    logger.warn("redis.connection.failed", { error, cacheEnabled: false });
    return false;
  });
const rateLimitStores = redisConnected
  ? createRedisRateLimitStores(redisClient)
  : undefined;
const weatherProvider = new CachedWeatherForecastProvider({
  cache: redisCache,
  coalescer: requestCoalescer,
  provider: new OpenMeteoWeatherClient({ baseUrl: env.WEATHER_BASE_URL }),
  onCacheError: (error) => {
    logger.warn("cache.weather.failed", { error });
  },
});
const marineProvider = new CachedMarineForecastProvider({
  cache: redisCache,
  coalescer: requestCoalescer,
  provider: new OpenMeteoMarineClient({ baseUrl: env.MARINE_BASE_URL }),
  onCacheError: (error) => {
    logger.warn("cache.marine.failed", { error });
  },
});
const weatherModelComparisonService = new WeatherModelComparisonService({
  batchLoader: new WeatherModelBatchLoader(
    new CachedModelWeatherForecastProvider({
      cache: redisCache,
      coalescer: requestCoalescer,
      provider: new OpenMeteoModelWeatherClient({
        baseUrls: {
          ...(env.WEATHER_MODEL_ECMWF_BASE_URL
            ? { ECMWF_IFS: env.WEATHER_MODEL_ECMWF_BASE_URL }
            : {}),
          ...(env.WEATHER_MODEL_DWD_BASE_URL
            ? { DWD_ICON: env.WEATHER_MODEL_DWD_BASE_URL }
            : {}),
          ...(env.WEATHER_MODEL_GFS_BASE_URL
            ? { NOAA_GFS: env.WEATHER_MODEL_GFS_BASE_URL }
            : {}),
        },
      }),
      onCacheError: (error) => {
        logger.warn("cache.weather_models.failed", { error });
      },
    }),
  ),
});
const coastalForecastService = new CoastalForecastService({
  locationRepository: coastalLocationRepository,
  weatherProvider,
  marineProvider,
  modelComparisonService: weatherModelComparisonService,
});
const routingProvider = new CachedRoutingProvider({
  cache: redisCache,
  coalescer: requestCoalescer,
  provider: new OsrmClient({ baseUrl: env.OSRM_BASE_URL }),
  onCacheError: (error) => {
    logger.warn("cache.routes.failed", { error });
  },
});
const beachForecastService = new BeachForecastService({
  beachRepository: new PrismaForecastBeachRepository(prisma),
  weatherProvider,
  marineProvider,
  modelComparisonService: weatherModelComparisonService,
});
const recommendationService = new RecommendationService({
  candidateService: new RecommendationCandidateService(
    new PrismaRecommendationCandidateRepository(prisma),
  ),
  forecastLoader: new CandidateForecastLoader({
    weatherProvider,
    marineProvider,
    concurrency: 3,
  }),
  routeLoader: new CandidateRouteLoader({
    routingProvider,
    concurrency: 2,
  }),
});
const routingService = new RoutingService({
  beachRepository: new PrismaRoutingBeachRepository(prisma),
  routingProvider,
});
const app = createApp({
  env,
  logger,
  ...(rateLimitStores ? { rateLimitStores } : {}),
  dependencies: {
    healthService,
    beachService,
    coastalLocationService,
    coastalLocationBeachesService,
    coastalForecastService,
    beachForecastService,
    recommendationService,
    routingService,
    weatherModelComparisonService,
  },
});

const server = app.listen(env.PORT, () => {
  logger.info("app.started", { port: env.PORT });
});

const shutdown = createGracefulShutdown({
  logger,
  stopServer: () => closeHttpServer(server),
  resources: [
    {
      name: "redis",
      close: async () => {
        await redisCache.disconnect();
      },
    },
    { name: "postgresql", close: () => prisma.$disconnect() },
  ],
  onFailure: () => {
    process.exitCode = 1;
  },
});
registerShutdownSignals(shutdown);

