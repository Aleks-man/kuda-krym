import { describe, expect, it } from "vitest";

import type { RecommendationContext } from "../../src/modules/recommendations/context/recommendation-context.js";
import type { CandidateForecastBatch } from "../../src/modules/recommendations/forecasts/candidate-forecast.js";
import { summarizeCandidateWindows } from "../../src/modules/recommendations/summaries/candidate-window-summarizer.js";
import type { WeatherForecast } from "../../src/modules/weather/weather-forecast.js";

const context: RecommendationContext = {
  origin: {
    code: "simferopol",
    name: "Симферополь",
    latitude: 44.952117,
    longitude: 34.102417,
  },
  date: "2026-08-24",
  forecastDays: 1,
  visitWindow: {
    startsAt: "2026-08-24T09:00:00.000Z",
    endsAt: "2026-08-24T11:00:00.000Z",
  },
  company: "ALONE",
  preferredSurface: "ANY",
  priority: "CALM_SEA",
};

describe("summarizeCandidateWindows", () => {
  it("selects the inclusive visit window and averages scores and metrics", () => {
    const batch = createBatch([
      createWeatherHour("2026-08-24T08:00", 18, 5, 2),
      createWeatherHour("2026-08-24T09:00", 24, 10, 3),
      createWeatherHour("2026-08-24T10:00", 26, 20, 4),
      createWeatherHour("2026-08-24T11:00", 28, 30, 5),
      createWeatherHour("2026-08-24T12:00", 30, 40, 6),
    ]);

    const result = summarizeCandidateWindows(batch, context);
    const summary = result.available[0]!;

    expect(summary.hourCount).toBe(3);
    expect(summary.averages).toMatchObject({
      airTemperatureCelsius: 26,
      seaSurfaceTemperatureCelsius: 25,
      waveHeightMeters: 0.3,
      windSpeedMetersPerSecond: 4,
      precipitationProbabilityPercent: 20,
    });
    expect(summary.scores.sea).toBeGreaterThan(90);
    expect(summary.scores.weather).toBeGreaterThan(85);
    expect(summary.scores.seaCoveragePercent).toBe(100);
  });

  it("preserves provider failures and marks a missing time window", () => {
    const batch = createBatch([createWeatherHour("2026-08-24T07:00", 20, 5, 2)]);
    batch.failures.push({
      candidateId: "broken",
      slug: "broken",
      code: "FORECAST_UNAVAILABLE",
    });

    const result = summarizeCandidateWindows(batch, context);

    expect(result.available).toEqual([]);
    expect(result.failures).toEqual([
      {
        candidateId: "broken",
        slug: "broken",
        code: "FORECAST_UNAVAILABLE",
      },
      {
        candidateId: "candidate-1",
        slug: "candidate",
        code: "NO_FORECAST_IN_VISIT_WINDOW",
      },
    ]);
  });

  it("reduces sea coverage when marine points are missing", () => {
    const batch = createBatch(
      [createWeatherHour("2026-08-24T10:00", 25, 10, 3)],
      false,
    );

    const summary = summarizeCandidateWindows(batch, context).available[0]!;

    expect(summary.scores.seaCoveragePercent).toBe(40);
    expect(summary.averages.waveHeightMeters).toBeNull();
    expect(summary.averages.seaSurfaceTemperatureCelsius).toBeNull();
  });
});

function createBatch(
  hourly: WeatherForecast["hourly"],
  includeMarine = true,
): CandidateForecastBatch {
  return {
    available: [
      {
        candidate: {
          id: "candidate-1",
          slug: "candidate",
          name: "Кандидат",
          latitude: 44.5,
          longitude: 34,
          surface: "SAND",
          childSuitability: "SUITABLE",
        },
        weather: {
          location: { latitude: 44.5, longitude: 34 },
          timezone: "UTC",
          generatedAt: "2026-08-24T06:00:00.000Z",
          hourly,
        },
        marine: {
          location: { latitude: 44.5, longitude: 34 },
          timezone: "UTC",
          generatedAt: "2026-08-24T06:00:00.000Z",
          hourly: includeMarine
            ? hourly.map((hour) => ({
                time: hour.time,
                seaSurfaceTemperatureCelsius: 25,
                waveHeightMeters: 0.3,
                waveDirectionDegrees: 220,
                wavePeriodSeconds: 4,
              }))
            : [],
        },
      },
    ],
    failures: [],
  };
}

function createWeatherHour(
  time: string,
  temperatureCelsius: number,
  precipitationProbabilityPercent: number,
  windSpeedMetersPerSecond: number,
): WeatherForecast["hourly"][number] {
  return {
    time,
    temperatureCelsius,
    precipitationProbabilityPercent,
    precipitationMillimeters: 0,
    windSpeedMetersPerSecond,
    windDirectionDegrees: 180,
    windGustMetersPerSecond: windSpeedMetersPerSecond + 1,
    cloudCoverPercent: 20,
  };
}
