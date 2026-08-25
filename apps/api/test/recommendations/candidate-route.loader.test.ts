import { describe, expect, it, vi } from "vitest";
import type { RecommendationCandidate } from "../../src/modules/recommendations/candidates/recommendation-candidate.js";
import { CandidateRouteLoader } from "../../src/modules/recommendations/routes/candidate-route.loader.js";

const origin = { latitude: 44.9521, longitude: 34.1024 };
const candidates = [
  createCandidate("1", "first", 44.1),
  createCandidate("2", "broken", 44.2),
  createCandidate("3", "third", 44.3),
  createCandidate("4", "fourth", 44.4),
];

describe("CandidateRouteLoader", () => {
  it("limits OSRM concurrency and isolates candidate failures", async () => {
    let activeRequests = 0;
    let maximumRequests = 0;
    const getDrivingRoute = vi.fn(async ({ destination }) => {
      activeRequests += 1;
      maximumRequests = Math.max(maximumRequests, activeRequests);
      await new Promise((resolve) => setTimeout(resolve, 2));
      activeRequests -= 1;

      if (destination.latitude === 44.2) throw new Error("route failed");
      return createRoute(destination);
    });
    const loader = new CandidateRouteLoader({
      routingProvider: { getDrivingRoute },
      concurrency: 2,
    });

    const result = await loader.load(candidates, origin);

    expect(maximumRequests).toBe(2);
    expect(result.available.map(({ candidate }) => candidate.slug)).toEqual([
      "first",
      "third",
      "fourth",
    ]);
    expect(result.failures).toEqual([
      { candidateId: "2", slug: "broken", code: "ROUTE_UNAVAILABLE" },
    ]);
    expect(getDrivingRoute).toHaveBeenCalledTimes(4);
    expect(getDrivingRoute).toHaveBeenCalledWith({
      origin,
      destination: { latitude: 44.1, longitude: 34 },
    });
  });

  it("returns an empty batch without calling the provider", async () => {
    const getDrivingRoute = vi.fn();
    const loader = new CandidateRouteLoader({
      routingProvider: { getDrivingRoute },
    });

    await expect(loader.load([], origin)).resolves.toEqual({
      available: [],
      failures: [],
    });
    expect(getDrivingRoute).not.toHaveBeenCalled();
  });
});

function createCandidate(
  id: string,
  slug: string,
  latitude: number,
): RecommendationCandidate {
  return {
    id,
    slug,
    name: slug,
    latitude,
    longitude: 34,
    surface: "SAND",
    childSuitability: "SUITABLE",
  };
}

function createRoute(destination: { latitude: number; longitude: number }) {
  return {
    origin,
    destination,
    distanceMeters: 50_000,
    durationSeconds: 3_600,
    geometry: {
      type: "LineString" as const,
      coordinates: [
        [origin.longitude, origin.latitude],
        [destination.longitude, destination.latitude],
      ] as [number, number][],
    },
    source: "OSRM" as const,
    calculatedAt: "2026-08-25T08:00:00.000Z",
  };
}
