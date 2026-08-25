import { describe, expect, it, vi } from "vitest";
import type { RoutingProvider } from "../../src/modules/routing/route.js";
import type { RoutingBeachRepository } from "../../src/modules/routing/routing-beach.repository.js";
import { RoutingService } from "../../src/modules/routing/routing.service.js";

const origin = { latitude: 44.9521, longitude: 34.1024 };
const beach = {
  id: "47f72fb6-dd75-4ca2-9f78-ad1e594dbcb4",
  latitude: 44.644844,
  longitude: 33.536119,
};

describe("RoutingService", () => {
  it("loads a published beach and requests a driving route", async () => {
    const beachRepository: RoutingBeachRepository = {
      findPublishedById: vi.fn().mockResolvedValue(beach),
    };
    const getDrivingRoute = vi.fn().mockResolvedValue({
      origin,
      destination: {
        latitude: beach.latitude,
        longitude: beach.longitude,
      },
      distanceMeters: 78_240,
      durationSeconds: 4_380,
      geometry: {
        type: "LineString",
        coordinates: [
          [34.1024, 44.9521],
          [33.536119, 44.644844],
        ],
      },
      source: "OSRM",
      calculatedAt: "2026-08-25T08:00:00.000Z",
    });
    const routingProvider: RoutingProvider = { getDrivingRoute };
    const service = new RoutingService({ beachRepository, routingProvider });

    const route = await service.calculateDrivingRoute(origin, beach.id);

    expect(beachRepository.findPublishedById).toHaveBeenCalledWith(beach.id);
    expect(getDrivingRoute).toHaveBeenCalledWith({
      origin,
      destination: {
        latitude: beach.latitude,
        longitude: beach.longitude,
      },
    });
    expect(route?.durationSeconds).toBe(4_380);
  });

  it("returns null without calling OSRM when the beach is unavailable", async () => {
    const beachRepository: RoutingBeachRepository = {
      findPublishedById: vi.fn().mockResolvedValue(null),
    };
    const getDrivingRoute = vi.fn();
    const service = new RoutingService({
      beachRepository,
      routingProvider: { getDrivingRoute },
    });

    await expect(
      service.calculateDrivingRoute(origin, beach.id),
    ).resolves.toBeNull();
    expect(getDrivingRoute).not.toHaveBeenCalled();
  });
});
