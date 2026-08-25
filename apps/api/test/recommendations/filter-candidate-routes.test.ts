import { describe, expect, it } from "vitest";
import type { RecommendationCandidate } from "../../src/modules/recommendations/candidates/recommendation-candidate.js";
import type { CandidateRoute } from "../../src/modules/recommendations/routes/candidate-route.js";
import { filterCandidateRoutes } from "../../src/modules/recommendations/routes/filter-candidate-routes.js";

describe("filterCandidateRoutes", () => {
  it("keeps routes within the maximum travel time", () => {
    const routes = [
      createCandidateRoute("near", 59 * 60 + 1),
      createCandidateRoute("limit", 60 * 60),
      createCandidateRoute("far", 60 * 60 + 1),
    ];

    const result = filterCandidateRoutes(routes, 60);

    expect(result.eligible.map(({ candidate }) => candidate.slug)).toEqual([
      "near",
      "limit",
    ]);
    expect(result.excluded).toEqual([
      {
        candidateId: "far",
        slug: "far",
        code: "TRAVEL_TIME_EXCEEDED",
        durationMinutes: 61,
        maximumMinutes: 60,
      },
    ]);
  });

  it("returns empty groups for an empty route list", () => {
    expect(filterCandidateRoutes([], 120)).toEqual({
      eligible: [],
      excluded: [],
    });
  });
});

function createCandidateRoute(
  slug: string,
  durationSeconds: number,
): CandidateRoute {
  const candidate: RecommendationCandidate = {
    id: slug,
    slug,
    name: slug,
    latitude: 44.5,
    longitude: 34,
    surface: "SAND",
    childSuitability: "SUITABLE",
  };

  return {
    candidate,
    route: {
      origin: { latitude: 44.95, longitude: 34.1 },
      destination: {
        latitude: candidate.latitude,
        longitude: candidate.longitude,
      },
      distanceMeters: 50_000,
      durationSeconds,
      geometry: {
        type: "LineString",
        coordinates: [
          [34.1, 44.95],
          [34, 44.5],
        ],
      },
      source: "OSRM",
      calculatedAt: "2026-08-25T08:00:00.000Z",
    },
  };
}
