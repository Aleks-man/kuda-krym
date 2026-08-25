import { describe, expect, it } from "vitest";
import type { RecommendationCandidate } from "../../src/modules/recommendations/candidates/recommendation-candidate.js";
import { mapRecommendationTravel } from "../../src/modules/recommendations/recommendation-travel.mapper.js";
import type { CandidateRoute } from "../../src/modules/recommendations/routes/candidate-route.js";

const candidate: RecommendationCandidate = {
  id: "beach-id",
  slug: "beach",
  name: "Beach",
  latitude: 44.5,
  longitude: 34,
  surface: "SAND",
  childSuitability: "SUITABLE",
};

const candidateRoute: CandidateRoute = {
  candidate,
  route: {
    origin: { latitude: 44.95, longitude: 34.1 },
    destination: { latitude: 44.5, longitude: 34 },
    distanceMeters: 78_240,
    durationSeconds: 4_381,
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

describe("mapRecommendationTravel", () => {
  it("maps compact travel data and rounds minutes up", () => {
    expect(mapRecommendationTravel(candidate.id, [candidateRoute])).toEqual({
      distanceMeters: 78_240,
      durationMinutes: 74,
    });
  });

  it("rejects a recommendation without a calculated route", () => {
    expect(() => mapRecommendationTravel(candidate.id, [])).toThrow(
      "Route is missing for recommendation beach-id",
    );
  });
});
