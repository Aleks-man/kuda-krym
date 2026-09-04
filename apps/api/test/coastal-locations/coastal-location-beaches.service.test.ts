import { describe, expect, it, vi } from "vitest";

import { CoastalLocationBeachesService } from "../../src/modules/coastal-locations/coastal-location-beaches.service.js";

const location = {
  id: "47f72fb6-dd75-4ca2-9f78-ad1e594dbcb4",
  slug: "sudak",
  name: "Судак",
  region: "EAST_CRIMEA",
  waterBody: "BLACK_SEA",
  weatherCoordinates: { latitude: 44.85, longitude: 34.97 },
  marineCoordinates: { latitude: 44.83, longitude: 34.98 },
  coverImage: null,
} as const;

describe("CoastalLocationBeachesService", () => {
  it("returns a published location with its beaches", async () => {
    const beaches = [{ slug: "sudak-central" }];
    const findBeaches = vi.fn().mockResolvedValue(beaches);
    const service = new CoastalLocationBeachesService({
      beachRepository: {
        findPublishedByCoastalLocationSlug: findBeaches,
      },
      coastalLocationRepository: {
        findPublishedBySlug: vi.fn().mockResolvedValue(location),
      },
    });

    await expect(service.listPublished("sudak")).resolves.toEqual({
      location,
      data: beaches,
      meta: { total: 1 },
    });
    expect(findBeaches).toHaveBeenCalledWith("sudak");
  });

  it("does not query beaches for an unknown location", async () => {
    const findBeaches = vi.fn();
    const service = new CoastalLocationBeachesService({
      beachRepository: {
        findPublishedByCoastalLocationSlug: findBeaches,
      },
      coastalLocationRepository: {
        findPublishedBySlug: vi.fn().mockResolvedValue(null),
      },
    });

    await expect(service.listPublished("unknown")).resolves.toBeNull();
    expect(findBeaches).not.toHaveBeenCalled();
  });
});
