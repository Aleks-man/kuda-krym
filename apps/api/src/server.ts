import "dotenv/config";

import { createPrismaClient } from "@kuda-krym/database";

import { createApp } from "./app.js";
import { parseEnv, requireDatabaseUrl } from "./config/env.js";
import { PrismaBeachRepository } from "./modules/beaches/prisma-beach.repository.js";
import { BeachService } from "./modules/beaches/beach.service.js";
import { BeachForecastService } from "./modules/forecast/beach-forecast.service.js";
import { PrismaForecastBeachRepository } from "./modules/forecast/prisma-forecast-beach.repository.js";
import { OpenMeteoMarineClient } from "./modules/marine/open-meteo/open-meteo-marine.client.js";
import { OpenMeteoWeatherClient } from "./modules/weather/open-meteo/open-meteo-weather.client.js";
import { RecommendationCandidateService } from "./modules/recommendations/candidates/recommendation-candidate.service.js";
import { PrismaRecommendationCandidateRepository } from "./modules/recommendations/candidates/prisma-recommendation-candidate.repository.js";
import { CandidateForecastLoader } from "./modules/recommendations/forecasts/candidate-forecast.loader.js";
import { RecommendationService } from "./modules/recommendations/recommendation.service.js";

const env = parseEnv(process.env);
const prisma = createPrismaClient(requireDatabaseUrl(env));
const beachRepository = new PrismaBeachRepository(prisma);
const beachService = new BeachService(beachRepository);
const weatherProvider = new OpenMeteoWeatherClient();
const marineProvider = new OpenMeteoMarineClient();
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
});
const app = createApp({
  env,
  dependencies: {
    beachService,
    beachForecastService,
    recommendationService,
  },
});

app.listen(env.PORT, () => {
  console.log(`API is running at http://localhost:${env.PORT}`);
});

