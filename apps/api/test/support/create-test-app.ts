import type { BeachDetail, BeachListItem } from "@kuda-krym/contracts";

import { createApp } from "../../src/app.js";
import { parseEnv } from "../../src/config/env.js";
import type { BeachRepository } from "../../src/modules/beaches/beach.repository.js";
import { BeachService } from "../../src/modules/beaches/beach.service.js";
import { BeachForecastService } from "../../src/modules/forecast/beach-forecast.service.js";
import type { ForecastBeach } from "../../src/modules/forecast/forecast-beach.repository.js";
import type { MarineForecast } from "../../src/modules/marine/marine-forecast.js";
import type { WeatherForecast } from "../../src/modules/weather/weather-forecast.js";
import type { RecommendationCalculation } from "../../src/modules/recommendations/recommendation-calculation.js";
import type { DrivingRoute } from "../../src/modules/routing/route.js";

type TestAppData = Readonly<{
  beaches?: BeachListItem[];
  details?: BeachDetail[];
  forecastBeach?: ForecastBeach | null;
  weatherForecast?: WeatherForecast;
  marineForecast?: MarineForecast;
  recommendationCalculation?: RecommendationCalculation;
  recommendationError?: Error | null;
  drivingRoute?: DrivingRoute | null;
  routingError?: Error | null;
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

const emptyRecommendationCalculation: RecommendationCalculation = {
  context: {
    origin: {
      code: "simferopol",
      name: "Симферополь",
      latitude: 44.952117,
      longitude: 34.102417,
    },
    date: "2026-08-20",
    forecastDays: 1,
    visitWindow: {
      startsAt: "2026-08-20T09:00:00.000Z",
      endsAt: "2026-08-20T14:00:00.000Z",
    },
    company: "ALONE",
    preferredSurface: "ANY",
    priority: "CALM_SEA",
  },
  recommendations: [],
  failures: [],
  meta: { candidateCount: 0, recommendationCount: 0, failureCount: 0 },
};

export function createTestApp({
  beaches = [],
  details = [],
  forecastBeach = null,
  weatherForecast = emptyWeatherForecast,
  marineForecast = emptyMarineForecast,
  recommendationCalculation = emptyRecommendationCalculation,
  recommendationError = null,
  drivingRoute = null,
  routingError = null,
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
      recommendationService: {
        calculate: async () => {
          if (recommendationError) throw recommendationError;
          return recommendationCalculation;
        },
      },
      routingService: {
        calculateDrivingRoute: async () => {
          if (routingError) throw routingError;
          return drivingRoute;
        },
      },
    },
  });
}

