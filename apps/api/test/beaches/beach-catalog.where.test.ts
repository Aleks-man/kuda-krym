import { describe, expect, it } from "vitest";

import { createPublishedBeachWhere } from "../../src/modules/beaches/beach-catalog.where.js";

describe("createPublishedBeachWhere", () => {
  it("always limits the query to published beaches with a profile", () => {
    expect(createPublishedBeachWhere({})).toMatchObject({
      publicationStatus: "PUBLISHED",
      profile: { isNot: null },
    });
  });

  it("builds case-insensitive search and exact catalog filters", () => {
    expect(
      createPublishedBeachWhere({
        q: "золотой",
        region: "EAST_CRIMEA",
        locality: "Береговое",
      }),
    ).toEqual({
      publicationStatus: "PUBLISHED",
      profile: { isNot: null },
      region: "EAST_CRIMEA",
      locality: { equals: "Береговое", mode: "insensitive" },
      OR: [
        { name: { contains: "золотой", mode: "insensitive" } },
        { officialName: { contains: "золотой", mode: "insensitive" } },
        { locality: { contains: "золотой", mode: "insensitive" } },
      ],
    });
  });
});
