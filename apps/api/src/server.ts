import "dotenv/config";

import { createPrismaClient } from "@kuda-krym/database";

import { createApp } from "./app.js";
import { parseEnv, requireDatabaseUrl } from "./config/env.js";
import { createRedisCacheClient } from "./shared/cache/redis-cache.client.js";
import { RedisCacheStore } from "./shared/cache/redis-cache.store.js";
import { PrismaBeachRepository } from "./modules/beaches/prisma-beach.repository.js";
import { BeachService } from "./modules/beaches/beach.service.js";
import { CoastalForecastService } from "./modules/coastal-forecast/coastal-forecast.service.js";
import { CoastalLocationService } from "./modules/coastal-locations/coastal-location.service.js";
import { PrismaCoastalLocationRepository } from "./modules/coastal-locations/prisma-coastal-location.repository.js";
import { BeachForecastService } from "./modules/forecast/beach-forecast.service.js";
import { PrismaForecastBeachRepository } from "./modules/forecast/prisma-forecast-beach.repository.js";
import { OpenMeteoMarineClient } from "./modules/marine/open-meteo/open-meteo-marine.client.js";
import { OpenMeteoWeatherClient } from "./modules/weather/open-meteo/open-meteo-weather.client.js";
import { CachedWeatherForecastProvider } from "./modules/weather/cache/cached-weather-forecast.provider.js";
import { WeatherModelBatchLoader } from "./modules/weather/models/comparison/weather-model-batch.loader.js";
import { WeatherModelComparisonService } from "./modules/weather/models/comparison/weather-model-comparison.service.js";
import { OpenMeteoModelWeatherClient } from "./modules/weather/models/open-meteo/open-meteo-model-weather.client.js";
import { RecommendationCandidateService } from "./modules/recommendations/candidates/recommendation-candidate.service.js";
import { PrismaRecommendationCandidateRepository } from "./modules/recommendations/candidates/prisma-recommendation-candidate.repository.js";
import { CandidateForecastLoader } from "./modules/recommendations/forecasts/candidate-forecast.loader.js";
import { RecommendationService } from "./modules/recommendations/recommendation.service.js";
import { CandidateRouteLoader } from "./modules/recommendations/routes/candidate-route.loader.js";
import { OsrmClient } from "./modules/routing/osrm/osrm.client.js";
import { PrismaRoutingBeachRepository } from "./modules/routing/prisma-routing-beach.repository.js";
import { RoutingService } from "./modules/routing/routing.service.js";

const env = parseEnv(process.env);
const prisma = createPrismaClient(requireDatabaseUrl(env));
const beachRepository = new PrismaBeachRepository(prisma);
const beachService = new BeachService(beachRepository);
const coastalLocationRepository = new PrismaCoastalLocationRepository(prisma);
const coastalLocationService = new CoastalLocationService(coastalLocationRepository);
const redisCache = new RedisCacheStore(
  createRedisCacheClient(env.REDIS_URL, (error) => {
    console.error("Redis client error", error);
  }),
);
void redisCache.connect().catch((error: unknown) => {
  console.error("Redis connection failed; continuing without cache", error);
});
const weatherProvider = new CachedWeatherForecastProvider({
  cache: redisCache,
  provider: new OpenMeteoWeatherClient(),
  onCacheError: (error) => {
    console.error("Weather cache error; using Open-Meteo directly", error);
  },
});
const marineProvider = new OpenMeteoMarineClient();
const weatherModelComparisonService = new WeatherModelComparisonService({
  batchLoader: new WeatherModelBatchLoader(
    new OpenMeteoModelWeatherClient(),
  ),
});
const coastalForecastService = new CoastalForecastService({
  locationRepository: coastalLocationRepository,
  weatherProvider,
  marineProvider,
  modelComparisonService: weatherModelComparisonService,
});
const routingProvider = new OsrmClient({ baseUrl: env.OSRM_BASE_URL });
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
  dependencies: {
    beachService,
    coastalLocationService,
    coastalForecastService,
    beachForecastService,
    recommendationService,
    routingService,
    weatherModelComparisonService,
  },
});

app.listen(env.PORT, () => {
  console.log(`API is running at http://localhost:${env.PORT}`);
});

