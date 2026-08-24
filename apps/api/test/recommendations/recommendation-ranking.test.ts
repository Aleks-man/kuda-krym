import { describe, expect, it } from "vitest";

import { rankRecommendationCandidates } from "../../src/modules/recommendations/ranking/rank-recommendation-candidates.js";
import { scoreRecommendationCandidate } from "../../src/modules/recommendations/ranking/score-recommendation-candidate.js";
import type { CandidateWindowSummary } from "../../src/modules/recommendations/summaries/candidate-window-summary.js";

describe("recommendation ranking", () => {
  it("changes the winner according to the selected priority", () => {
    const calm = createSummary("calm", 98, 60, 24);
    const comfortable = createSummary("comfortable", 70, 96, 25);
    const batch = { available: [comfortable, calm], failures: [] };

    expect(
      rankRecommendationCandidates(batch, "CALM_SEA").recommendations[0]
        ?.candidate.slug,
    ).toBe("calm");
    expect(
      rankRecommendationCandidates(batch, "COMFORT").recommendations[0]
        ?.candidate.slug,
    ).toBe("comfortable");
  });

  it("rewards warmer comfortable water for the warm-water priority", () => {
    const cool = createSummary("cool", 90, 90, 18);
    const warm = createSummary("warm", 85, 85, 27);

    const result = rankRecommendationCandidates(
      { available: [cool, warm], failures: [] },
      "WARM_WATER",
    );

    expect(result.recommendations[0]?.candidate.slug).toBe("warm");
    expect(result.recommendations[0]?.components).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "WARM_WATER", score: 100 }),
      ]),
    );
  });

  it("penalizes a high raw score with incomplete coverage", () => {
    const incomplete = createSummary("incomplete", 100, null, null, 40, 0);
    const complete = createSummary("complete", 90, 90, 25);

    const incompleteScore = scoreRecommendationCandidate(
      incomplete,
      "CALM_SEA",
    )!;
    const result = rankRecommendationCandidates(
      { available: [incomplete, complete], failures: [] },
      "CALM_SEA",
    );

    expect(incompleteScore.rawScore).toBe(100);
    expect(incompleteScore.score).toBeLessThan(incompleteScore.rawScore);
    expect(result.recommendations[0]?.candidate.slug).toBe("complete");
  });

  it("selects three candidates and preserves failures", () => {
    const available = [
      createSummary("one", 95, 90, 26),
      createSummary("two", 90, 90, 25),
      createSummary("three", 85, 85, 24),
      createSummary("four", 80, 80, 23),
      createSummary("missing", null, null, null, 0, 0),
    ];

    const result = rankRecommendationCandidates(
      {
        available,
        failures: [
          {
            candidateId: "upstream",
            slug: "upstream",
            code: "FORECAST_UNAVAILABLE",
          },
        ],
      },
      "CALM_SEA",
    );

    expect(result.recommendations).toHaveLength(3);
    expect(result.recommendations.map(({ position }) => position)).toEqual([
      1, 2, 3,
    ]);
    expect(result.failures).toEqual([
      {
        candidateId: "upstream",
        slug: "upstream",
        code: "FORECAST_UNAVAILABLE",
      },
      {
        candidateId: "missing",
        slug: "missing",
        code: "INSUFFICIENT_SCORE_DATA",
      },
    ]);
  });
});

function createSummary(
  slug: string,
  sea: number | null,
  weather: number | null,
  waterTemperature: number | null,
  seaCoveragePercent = 100,
  weatherCoveragePercent = 100,
): CandidateWindowSummary {
  return {
    candidate: {
      id: slug,
      slug,
      name: slug,
      latitude: 44.5,
      longitude: 34,
      surface: "SAND",
      childSuitability: "SUITABLE",
    },
    visitWindow: {
      startsAt: "2026-08-24T09:00:00.000Z",
      endsAt: "2026-08-24T14:00:00.000Z",
    },
    hourCount: 6,
    scores: {
      sea,
      weather,
      seaCoveragePercent,
      weatherCoveragePercent,
    },
    averages: {
      airTemperatureCelsius: 26,
      seaSurfaceTemperatureCelsius: waterTemperature,
      waveHeightMeters: 0.3,
      windSpeedMetersPerSecond: 3,
      precipitationProbabilityPercent: 10,
    },
  };
}
