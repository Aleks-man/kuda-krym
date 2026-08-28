import type {
  BeachDetail,
  BeachListItem,
  CoastalLocation,
  WeatherModelComparisonResponse,
} from "@kuda-krym/contracts";

import { createApp } from "../../src/app.js";
import { parseEnv } from "../../src/config/env.js";
import type { BeachRepository } from "../../src/modules/beaches/beach.repository.js";
import { BeachService } from "../../src/modules/beaches/beach.service.js";
import { CoastalForecastService } from "../../src/modules/coastal-forecast/coastal-forecast.service.js";
import { CoastalLocationService } from "../../src/modules/coastal-locations/coastal-location.service.js";
import { BeachForecastService } from "../../src/modules/forecast/beach-forecast.service.js";
import type { ForecastBeach } from "../../src/modules/forecast/forecast-beach.repository.js";
import type { MarineForecast } from "../../src/modules/marine/marine-forecast.js";
import type { WeatherForecast } from "../../src/modules/weather/weather-forecast.js";
import type { RecommendationCalculation } from "../../src/modules/recommendations/recommendation-calculation.js";
import type { DrivingRoute } from "../../src/modules/routing/route.js";
import type { Logger } from "../../src/shared/logging/logger.js";

const silentLogger: Logger = {
  info: () => undefined,
  warn: () => undefined,
  error: () => undefined,
};

type TestAppData = Readonly<{
  beaches?: BeachListItem[];
  details?: BeachDetail[];
  coastalLocations?: CoastalLocation[];
  forecastBeach?: ForecastBeach | null;
  weatherForecast?: WeatherForecast;
  marineForecast?: MarineForecast;
  recommendationCalculation?: RecommendationCalculation;
  recommendationError?: Error | null;
  drivingRoute?: DrivingRoute | null;
  routingError?: Error | null;
  weatherModelComparison?: WeatherModelComparisonResponse;
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
    maxTravelMinutes: 120,
  },
  recommendations: [],
  candidateRoutes: [],
  failures: [],
  meta: { candidateCount: 0, recommendationCount: 0, failureCount: 0 },
};

const emptyWeatherModelComparison: WeatherModelComparisonResponse = {
  location: { latitude: 0, longitude: 0 },
  generatedAt: "2026-08-20T08:00:00.000Z",
  freshness: null,
  models: { available: [], failures: [] },
  hourly: [],
};

export function createTestApp({
  beaches = [],
  details = [],
  coastalLocations = [],
  forecastBeach = null,
  weatherForecast = emptyWeatherForecast,
  marineForecast = emptyMarineForecast,
  recommendationCalculation = emptyRecommendationCalculation,
  recommendationError = null,
  drivingRoute = null,
  routingError = null,
  weatherModelComparison = emptyWeatherModelComparison,
}: TestAppData = {}) {
  const modelComparisonService = {
    compare: async (comparisonLocation: {
      latitude: number;
      longitude: number;
    }) => ({
      ...weatherModelComparison,
      location: comparisonLocation,
    }),
  };
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
    modelComparisonService,
    now: () => new Date("2026-08-20T08:05:00.000Z"),
  });
  const coastalLocationRepository = {
    findPublished: async () => coastalLocations,
    findPublishedBySlug: async (slug: string) =>
      coastalLocations.find((location) => location.slug === slug) ?? null,
  };
  const coastalForecastService = new CoastalForecastService({
    locationRepository: coastalLocationRepository,
    weatherProvider: { getForecast: async () => weatherForecast },
    marineProvider: { getForecast: async () => marineForecast },
    modelComparisonService,
    now: () => new Date("2026-08-20T08:05:00.000Z"),
  });

  return createApp({
    env: parseEnv({ NODE_ENV: "test" }),
    logger: silentLogger,
    dependencies: {
      beachService: new BeachService(beachRepository),
      coastalLocationService: new CoastalLocationService({
        ...coastalLocationRepository,
      }),
      coastalForecastService,
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
      weatherModelComparisonService: {
        ...modelComparisonService,
      },
    },
  });
}

