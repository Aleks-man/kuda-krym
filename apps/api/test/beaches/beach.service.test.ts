import type { BeachRepository } from "../../src/modules/beaches/beach.repository.js";
import { BeachService } from "../../src/modules/beaches/beach.service.js";
import { describe, expect, it, vi } from "vitest";

describe("BeachService", () => {
  it("passes catalog filters to the repository", async () => {
    const repository = createRepository();
    const service = new BeachService(repository);
    const query = { region: "SOUTH_COAST" } as const;

    await expect(service.listPublished(query)).resolves.toEqual({
      data: [],
      meta: { total: 0 },
    });
    expect(repository.findPublished).toHaveBeenCalledWith(query);
  });

  it("wraps available filter options in the API contract", async () => {
    const repository = createRepository();
    const service = new BeachService(repository);

    await expect(service.getFilterOptions()).resolves.toEqual({
      data: { regions: ["SOUTH_COAST"] },
    });
  });
});

function createRepository(): BeachRepository {
  return {
    findPublished: vi.fn().mockResolvedValue([]),
    findPublishedByCoastalLocationSlug: vi.fn().mockResolvedValue([]),
    findPublishedFilterOptions: vi.fn().mockResolvedValue({
      regions: ["SOUTH_COAST"],
    }),
    findPublishedBySlug: vi.fn().mockResolvedValue(null),
  };
}
