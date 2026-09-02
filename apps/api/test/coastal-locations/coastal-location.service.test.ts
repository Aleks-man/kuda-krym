import { describe, expect, it, vi } from "vitest";
import type { CoastalLocationRepository } from "../../src/modules/coastal-locations/coastal-location.repository.js";
import { CoastalLocationService } from "../../src/modules/coastal-locations/coastal-location.service.js";

const yalta = {
  id: "47f72fb6-dd75-4ca2-9f78-ad1e594dbcb4",
  slug: "yalta",
  name: "Ялта",
  region: "SOUTH_COAST",
  waterBody: "BLACK_SEA",
  weatherCoordinates: { latitude: 44.495, longitude: 34.166 },
  marineCoordinates: { latitude: 44.46, longitude: 34.17 },
  coverImage: null,
} as const;

describe("CoastalLocationService", () => {
  it("returns published locations with total metadata", async () => {
    const repository: CoastalLocationRepository = {
      findPublished: vi.fn().mockResolvedValue([yalta]),
      findPublishedBySlug: vi.fn(),
    };
    const service = new CoastalLocationService(repository);

    await expect(service.listPublished()).resolves.toEqual({
      data: [yalta],
      meta: { total: 1 },
    });
  });

  it("delegates a slug lookup to the repository", async () => {
    const findPublishedBySlug = vi.fn().mockResolvedValue(yalta);
    const repository: CoastalLocationRepository = {
      findPublished: vi.fn(),
      findPublishedBySlug,
    };
    const service = new CoastalLocationService(repository);

    await expect(service.getPublishedBySlug("yalta")).resolves.toEqual(yalta);
    expect(findPublishedBySlug).toHaveBeenCalledWith("yalta");
  });
});
