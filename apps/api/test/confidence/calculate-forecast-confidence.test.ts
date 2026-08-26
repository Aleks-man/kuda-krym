import { describe, expect, it } from "vitest";

import { calculateForecastConfidence } from "../../src/modules/confidence/calculate-forecast-confidence.js";

const evaluatedAt = new Date("2026-08-26T09:00:00.000Z");

describe("calculateForecastConfidence", () => {
  it("returns high confidence for fresh, near and complete data", () => {
    const result = calculateForecastConfidence({
      generatedAt: "2026-08-26T08:00:00.000Z",
      forecastTime: "2026-08-26T15:00:00.000Z",
      completenessPercent: 100,
      evaluatedAt,
    });

    expect(result).toMatchObject({ score: 100, level: "HIGH" });
    expect(result.factors).toEqual([
      { name: "FRESHNESS", score: 100, weight: 0.4 },
      { name: "HORIZON", score: 100, weight: 0.25 },
      { name: "COMPLETENESS", score: 100, weight: 0.35 },
    ]);
  });

  it("reduces confidence for stale, distant and incomplete data", () => {
    const result = calculateForecastConfidence({
      generatedAt: "2026-08-25T09:00:00.000Z",
      forecastTime: "2026-08-29T09:00:00.000Z",
      completenessPercent: 40,
      evaluatedAt,
    });

    expect(result.score).toBe(33);
    expect(result.level).toBe("LOW");
  });

  it("interpolates factor scores between configured boundaries", () => {
    const result = calculateForecastConfidence({
      generatedAt: "2026-08-26T04:30:00.000Z",
      forecastTime: "2026-08-27T15:00:00.000Z",
      completenessPercent: 80,
      evaluatedAt,
    });

    expect(result.factors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "FRESHNESS", score: 90 }),
        expect.objectContaining({ name: "HORIZON", score: 83 }),
      ]),
    );
    expect(result).toMatchObject({ score: 85, level: "HIGH" });
  });

  it("includes model agreement without changing legacy weights when absent", () => {
    const result = calculateForecastConfidence({
      generatedAt: "2026-08-26T08:00:00.000Z",
      forecastTime: "2026-08-26T15:00:00.000Z",
      completenessPercent: 100,
      modelAgreementPercent: 20,
      evaluatedAt,
    });

    expect(result).toMatchObject({ score: 76, level: "MEDIUM" });
    expect(result.factors).toEqual([
      { name: "FRESHNESS", score: 100, weight: 0.28 },
      { name: "HORIZON", score: 100, weight: 0.175 },
      {
        name: "COMPLETENESS",
        score: 100,
        weight: expect.closeTo(0.245),
      },
      { name: "MODEL_AGREEMENT", score: 20, weight: 0.3 },
    ]);
  });

  it("rejects invalid dates and completeness", () => {
    expect(() =>
      calculateForecastConfidence({
        generatedAt: "invalid",
        forecastTime: "2026-08-26T15:00:00.000Z",
        completenessPercent: 100,
        evaluatedAt,
      }),
    ).toThrow("generatedAt must be a valid ISO date");

    expect(() =>
      calculateForecastConfidence({
        generatedAt: "2026-08-26T08:00:00.000Z",
        forecastTime: "2026-08-26T15:00:00.000Z",
        completenessPercent: 101,
        evaluatedAt,
      }),
    ).toThrow("completenessPercent must be between 0 and 100");

    expect(() =>
      calculateForecastConfidence({
        generatedAt: "2026-08-26T08:00:00.000Z",
        forecastTime: "2026-08-26T15:00:00.000Z",
        completenessPercent: 100,
        modelAgreementPercent: -1,
        evaluatedAt,
      }),
    ).toThrow("modelAgreementPercent must be between 0 and 100");
  });
});
