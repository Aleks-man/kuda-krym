import { describe, expect, it, vi } from "vitest";

import { RecommendationCandidateService } from "../../src/modules/recommendations/candidates/recommendation-candidate.service.js";

describe("RecommendationCandidateService", () => {
  it("returns all published candidates", async () => {
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

    const result = await service.listEligible();

    expect(findPublished).toHaveBeenCalledOnce();
    expect(result.map((candidate) => candidate.slug)).toEqual([
      "family",
      "unknown",
    ]);
  });
});
