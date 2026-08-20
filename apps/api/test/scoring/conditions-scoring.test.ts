import { describe, expect, it } from "vitest";

import { scoreSeaConditions } from "../../src/modules/scoring/sea-conditions.score.js";
import { scoreWeatherComfort } from "../../src/modules/scoring/weather-comfort.score.js";

describe("conditions scoring", () => {
  it("rates calm, warm sea conditions highly", () => {
    const result = scoreSeaConditions({
      waveHeightMeters: 0.2,
      windSpeedMetersPerSecond: 2.5,
      waterTemperatureCelsius: 26,
      windGustMetersPerSecond: 4,
    });

    expect(result.score).toBeGreaterThanOrEqual(95);
    expect(result.coveragePercent).toBe(100);
  });

  it("penalizes rough and windy sea conditions", () => {
    const result = scoreSeaConditions({
      waveHeightMeters: 1.4,
      windSpeedMetersPerSecond: 12,
      waterTemperatureCelsius: 20,
      windGustMetersPerSecond: 17,
    });

    expect(result.score).toBeLessThan(25);
  });

  it("reports reduced coverage without inventing missing factors", () => {
    const result = scoreSeaConditions({
      waveHeightMeters: 0.3,
      windSpeedMetersPerSecond: null,
      waterTemperatureCelsius: null,
      windGustMetersPerSecond: null,
    });

    expect(result.score).toBe(100);
    expect(result.coveragePercent).toBe(40);
    expect(result.factors.filter((factor) => factor.score === null)).toHaveLength(3);
  });

  it("rates dry and comfortable weather highly", () => {
    const result = scoreWeatherComfort({
      airTemperatureCelsius: 25,
      precipitationProbabilityPercent: 5,
      precipitationMillimeters: 0,
      cloudCoverPercent: 20,
    });

    expect(result.score).toBeGreaterThanOrEqual(95);
    expect(result.coveragePercent).toBe(100);
  });

  it("returns no score when every factor is missing", () => {
    const result = scoreWeatherComfort({
      airTemperatureCelsius: null,
      precipitationProbabilityPercent: null,
      precipitationMillimeters: null,
      cloudCoverPercent: null,
    });

    expect(result.score).toBeNull();
    expect(result.coveragePercent).toBe(0);
  });
});
