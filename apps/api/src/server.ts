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

const env = parseEnv(process.env);
const prisma = createPrismaClient(requireDatabaseUrl(env));
const beachRepository = new PrismaBeachRepository(prisma);
const beachService = new BeachService(beachRepository);
const beachForecastService = new BeachForecastService({
  beachRepository: new PrismaForecastBeachRepository(prisma),
  weatherProvider: new OpenMeteoWeatherClient(),
  marineProvider: new OpenMeteoMarineClient(),
});
const app = createApp({
  env,
  dependencies: { beachService, beachForecastService },
});

app.listen(env.PORT, () => {
  console.log(`API is running at http://localhost:${env.PORT}`);
});

