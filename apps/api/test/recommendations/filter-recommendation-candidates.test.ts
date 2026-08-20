import { describe, expect, it } from "vitest";

import { filterRecommendationCandidates } from "../../src/modules/recommendations/candidates/filter-recommendation-candidates.js";
import type { RecommendationCandidate } from "../../src/modules/recommendations/candidates/recommendation-candidate.js";

const candidates: RecommendationCandidate[] = [
  {
    id: "1",
    slug: "sandy-family",
    name: "Песчаный семейный пляж",
    latitude: 45,
    longitude: 33,
    surface: "SAND",
    childSuitability: "SUITABLE",
  },
  {
    id: "2",
    slug: "pebble-family",
    name: "Галечный семейный пляж",
    latitude: 44.5,
    longitude: 34.1,
    surface: "PEBBLE",
    childSuitability: "SUITABLE",
  },
  {
    id: "3",
    slug: "sandy-unknown",
    name: "Песчаный пляж без проверки",
    latitude: 44.6,
    longitude: 33.5,
    surface: "SAND",
    childSuitability: "UNKNOWN",
  },
  {
    id: "4",
    slug: "mixed-family",
    name: "Смешанный семейный пляж",
    latitude: 44.7,
    longitude: 33.6,
    surface: "MIXED",
    childSuitability: "SUITABLE",
  },
];

describe("filterRecommendationCandidates", () => {
  it("keeps only confirmed child-suitable sandy beaches", () => {
    const result = filterRecommendationCandidates(candidates, {
      company: "WITH_CHILDREN",
      preferredSurface: "SAND",
    });

    expect(result.map((candidate) => candidate.slug)).toEqual([
      "sandy-family",
    ]);
  });

  it("does not treat mixed or unknown surfaces as a requested surface", () => {
    const result = filterRecommendationCandidates(candidates, {
      company: "FRIENDS",
      preferredSurface: "PEBBLE",
    });

    expect(result.map((candidate) => candidate.slug)).toEqual([
      "pebble-family",
    ]);
  });

  it("keeps all published candidates when preferences impose no filter", () => {
    const result = filterRecommendationCandidates(candidates, {
      company: "ALONE",
      preferredSurface: "ANY",
    });

    expect(result).toEqual(candidates);
    expect(result).not.toBe(candidates);
  });
});
