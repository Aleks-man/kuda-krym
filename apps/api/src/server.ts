import "dotenv/config";

import { createPrismaClient } from "@kuda-krym/database";

import { createApp } from "./app.js";
import { parseEnv, requireDatabaseUrl } from "./config/env.js";
import { PrismaBeachRepository } from "./modules/beaches/prisma-beach.repository.js";
import { BeachService } from "./modules/beaches/beach.service.js";
import { CoastalForecastService } from "./modules/coastal-forecast/coastal-forecast.service.js";
import { CoastalLocationService } from "./modules/coastal-locations/coastal-location.service.js";
import { PrismaCoastalLocationRepository } from "./modules/coastal-locations/prisma-coastal-location.repository.js";
import { BeachForecastService } from "./modules/forecast/beach-forecast.service.js";
import { PrismaForecastBeachRepository } from "./modules/forecast/prisma-forecast-beach.repository.js";
import { OpenMeteoMarineClient } from "./modules/marine/open-meteo/open-meteo-marine.client.js";
import { OpenMeteoWeatherClient } from "./modules/weather/open-meteo/open-meteo-weather.client.js";
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
const weatherProvider = new OpenMeteoWeatherClient();
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
});
const routingProvider = new OsrmClient({ baseUrl: env.OSRM_BASE_URL });
const beachForecastService = new BeachForecastService({
  beachRepository: new PrismaForecastBeachRepository(prisma),
  weatherProvider,
  marineProvider,
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

