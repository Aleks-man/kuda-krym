import { describe, expect, it, vi } from "vitest";

import { RecommendationCandidateService } from "../../src/modules/recommendations/candidates/recommendation-candidate.service.js";
import type { RecommendationContext } from "../../src/modules/recommendations/context/recommendation-context.js";

const context: RecommendationContext = {
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
  company: "WITH_CHILDREN",
  preferredSurface: "SAND",
  priority: "CALM_SEA",
};

describe("RecommendationCandidateService", () => {
  it("loads published candidates and applies context preferences", async () => {
    const findPublished = vi.fn().mockResolvedValue([
      {
        id: "1",
        slug: "family",
        name: "Семейный пляж",
        latitude: 45,
        longitude: 33,
        surface: "SAND",
        childSuitability: "SUITABLE",
      },
      {
        id: "2",
        slug: "unknown",
        name: "Непроверенный пляж",
        latitude: 44,
        longitude: 34,
        surface: "SAND",
        childSuitability: "UNKNOWN",
      },
    ]);
    const service = new RecommendationCandidateService({ findPublished });

    const result = await service.listEligible(context);

    expect(findPublished).toHaveBeenCalledOnce();
    expect(result.map((candidate) => candidate.slug)).toEqual(["family"]);
  });
});
