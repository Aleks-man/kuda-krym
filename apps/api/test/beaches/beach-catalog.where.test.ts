import { describe, expect, it } from "vitest";

import { createPublishedBeachWhere } from "../../src/modules/beaches/beach-catalog.where.js";

describe("createPublishedBeachWhere", () => {
  it("always limits the query to published beaches with a profile", () => {
    expect(createPublishedBeachWhere({})).toMatchObject({
      publicationStatus: "PUBLISHED",
      profile: { isNot: null },
    });
  });

  it("builds a region filter", () => {
    expect(
      createPublishedBeachWhere({
        region: "EAST_CRIMEA",
      }),
    ).toEqual({
      publicationStatus: "PUBLISHED",
      profile: { isNot: null },
      region: "EAST_CRIMEA",
    });
  });
});
