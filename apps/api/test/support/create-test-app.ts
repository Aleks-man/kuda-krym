import type { BeachDetail, BeachListItem } from "@kuda-krym/contracts";

import { createApp } from "../../src/app.js";
import { parseEnv } from "../../src/config/env.js";
import type { BeachRepository } from "../../src/modules/beaches/beach.repository.js";
import { BeachService } from "../../src/modules/beaches/beach.service.js";
import { BeachForecastService } from "../../src/modules/forecast/beach-forecast.service.js";
import type { ForecastBeach } from "../../src/modules/forecast/forecast-beach.repository.js";
import type { MarineForecast } from "../../src/modules/marine/marine-forecast.js";
import type { WeatherForecast } from "../../src/modules/weather/weather-forecast.js";

type TestAppData = Readonly<{
  beaches?: BeachListItem[];
  details?: BeachDetail[];
  forecastBeach?: ForecastBeach | null;
  weatherForecast?: WeatherForecast;
  marineForecast?: MarineForecast;
}>;

const emptyWeatherForecast: WeatherForecast = {
  location: { latitude: 0, longitude: 0 },
  timezone: "UTC",
  generatedAt: "2026-08-20T08:00:00.000Z",
  hourly: [],
};

const emptyMarineForecast: MarineForecast = {
  location: { latitude: 0, longitude: 0 },
  timezone: "UTC",
  generatedAt: "2026-08-20T08:00:00.000Z",
  hourly: [],
};

export function createTestApp({
  beaches = [],
  details = [],
  forecastBeach = null,
  weatherForecast = emptyWeatherForecast,
  marineForecast = emptyMarineForecast,
}: TestAppData = {}) {
  const beachRepository: BeachRepository = {
    findPublished: async () => beaches,
    findPublishedBySlug: async (slug) =>
      details.find((beach) => beach.slug === slug) ?? null,
  };
  const beachForecastService = new BeachForecastService({
    beachRepository: {
      findPublishedById: async (id) =>
        forecastBeach?.id === id ? forecastBeach : null,
    },
    weatherProvider: { getForecast: async () => weatherForecast },
    marineProvider: { getForecast: async () => marineForecast },
    now: () => new Date("2026-08-20T08:05:00.000Z"),
  });

  return createApp({
    env: parseEnv({ NODE_ENV: "test" }),
    dependencies: {
      beachService: new BeachService(beachRepository),
      beachForecastService,
    },
  });
}

