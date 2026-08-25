import { describe, expect, it, vi } from "vitest";

import type { MarineForecast } from "../../src/modules/marine/marine-forecast.js";
import type { RecommendationCandidate } from "../../src/modules/recommendations/candidates/recommendation-candidate.js";
import { CandidateForecastLoader } from "../../src/modules/recommendations/forecasts/candidate-forecast.loader.js";
import { RecommendationService } from "../../src/modules/recommendations/recommendation.service.js";
import { CandidateRouteLoader } from "../../src/modules/recommendations/routes/candidate-route.loader.js";
import type {
  RoutePoint,
  RoutingProvider,
} from "../../src/modules/routing/route.js";
import type { WeatherForecast } from "../../src/modules/weather/weather-forecast.js";

const now = new Date("2026-08-24T06:00:00.000Z");
const request = {
  origin: "simferopol",
  date: "2026-08-24",
  time: "day",
  company: "alone",
  surface: "any",
  priority: "calm_sea",
  maxTravelMinutes: 120,
} as const;

describe("RecommendationService", () => {
  it("runs the complete pipeline and returns ranked recommendations", async () => {
    const candidates = [
      createCandidate("calm", 44.5),
      createCandidate("rough", 44.6),
    ];
    const listEligible = vi.fn().mockResolvedValue(candidates);
    const loader = new CandidateForecastLoader({
      weatherProvider: {
        getForecast: vi.fn(async ({ location }) =>
          createWeatherForecast(location),
        ),
      },
      marineProvider: {
        getForecast: vi.fn(async ({ location }) =>
          createMarineForecast(location, location.latitude === 44.5 ? 0.2 : 1.2),
        ),
      },
      concurrency: 2,
    });
    const service = new RecommendationService({
      candidateService: { listEligible },
      forecastLoader: loader,
      routeLoader: createRouteLoader(),
      now: () => now,
    });

    const result = await service.calculate(request);

    expect(listEligible).toHaveBeenCalledWith(
      expect.objectContaining({
        forecastDays: 1,
        priority: "CALM_SEA",
        visitWindow: {
          startsAt: "2026-08-24T09:00:00.000Z",
          endsAt: "2026-08-24T14:00:00.000Z",
        },
      }),
    );
    expect(result.recommendations[0]?.candidate.slug).toBe("calm");
    expect(result.candidateRoutes).toHaveLength(2);
    expect(result.meta).toEqual({
      candidateCount: 2,
      recommendationCount: 2,
      failureCount: 0,
    });
  });

  it("returns an empty calculation without calling external providers", async () => {
    const weatherProvider = { getForecast: vi.fn() };
    const marineProvider = { getForecast: vi.fn() };
    const service = new RecommendationService({
      candidateService: { listEligible: vi.fn().mockResolvedValue([]) },
      forecastLoader: new CandidateForecastLoader({
        weatherProvider,
        marineProvider,
      }),
      routeLoader: createRouteLoader(),
      now: () => now,
    });

    const result = await service.calculate(request);

    expect(result.recommendations).toEqual([]);
    expect(result.meta.candidateCount).toBe(0);
    expect(weatherProvider.getForecast).not.toHaveBeenCalled();
    expect(marineProvider.getForecast).not.toHaveBeenCalled();
  });

  it("does not load forecasts for candidates beyond the travel limit", async () => {
    const near = createCandidate("near", 44.5);
    const far = createCandidate("far", 44.6);
    const getForecast = vi.fn(async ({ location }) =>
      createWeatherForecast(location),
    );
    const service = new RecommendationService({
      candidateService: {
        listEligible: vi.fn().mockResolvedValue([near, far]),
      },
      routeLoader: createRouteLoader((destination) =>
        destination.latitude === far.latitude ? 121 : 60,
      ),
      forecastLoader: new CandidateForecastLoader({
        weatherProvider: { getForecast },
        marineProvider: {
          getForecast: vi.fn(async ({ location }) =>
            createMarineForecast(location, 0.2),
          ),
        },
      }),
      now: () => now,
    });

    const result = await service.calculate(request);

    expect(getForecast).toHaveBeenCalledTimes(1);
    expect(result.candidateRoutes[0]?.candidate.slug).toBe("near");
    expect(result.failures).toContainEqual(
      expect.objectContaining({
        slug: "far",
        code: "TRAVEL_TIME_EXCEEDED",
        durationMinutes: 121,
      }),
    );
    expect(result.meta.failureCount).toBe(1);
  });
});

function createRouteLoader(
  durationMinutes: (destination: RoutePoint) => number = () => 60,
) {
  const routingProvider: RoutingProvider = {
    getDrivingRoute: vi.fn<RoutingProvider["getDrivingRoute"]>(async ({ origin, destination }) => ({
      origin,
      destination,
      distanceMeters: 50_000,
      durationSeconds: durationMinutes(destination) * 60,
      geometry: {
        type: "LineString" as const,
        coordinates: [
          [origin.longitude, origin.latitude] as [number, number],
          [destination.longitude, destination.latitude] as [number, number],
        ],
      },
      source: "OSRM",
      calculatedAt: "2026-08-24T06:00:00.000Z",
    })),
  };

  return new CandidateRouteLoader({
    routingProvider,
  });
}

function createCandidate(
  slug: string,
  latitude: number,
): RecommendationCandidate {
  return {
    id: slug,
    slug,
    name: slug,
    latitude,
    longitude: 34,
    surface: "SAND",
    childSuitability: "SUITABLE",
  };
}

function createWeatherForecast(
  location: Readonly<{ latitude: number; longitude: number }>,
): WeatherForecast {
  return {
    location,
    timezone: "UTC",
    generatedAt: "2026-08-24T06:00:00.000Z",
    hourly: [9, 10, 11, 12, 13, 14].map((hour) => ({
      time: `2026-08-24T${hour.toString().padStart(2, "0")}:00`,
      temperatureCelsius: 26,
      precipitationProbabilityPercent: 5,
      precipitationMillimeters: 0,
      windSpeedMetersPerSecond: 2,
      windDirectionDegrees: 180,
      windGustMetersPerSecond: 3,
      cloudCoverPercent: 15,
    })),
  };
}

function createMarineForecast(
  location: Readonly<{ latitude: number; longitude: number }>,
  waveHeightMeters: number,
): MarineForecast {
  return {
    location,
    timezone: "UTC",
    generatedAt: "2026-08-24T06:00:00.000Z",
    hourly: [9, 10, 11, 12, 13, 14].map((hour) => ({
      time: `2026-08-24T${hour.toString().padStart(2, "0")}:00`,
      seaSurfaceTemperatureCelsius: 25,
      waveHeightMeters,
      waveDirectionDegrees: 220,
      wavePeriodSeconds: 4,
    })),
  };
}
