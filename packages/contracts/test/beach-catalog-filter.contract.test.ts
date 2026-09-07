import { describe, expect, it } from "vitest";

import {
  beachCatalogFilterOptionsSchema,
  beachCatalogQuerySchema,
} from "../src/index.js";

describe("beach catalog filter contracts", () => {
  it("normalizes supported catalog filters", () => {
    expect(
      beachCatalogQuerySchema.parse({
        region: "EAST_CRIMEA",
      }),
    ).toEqual({
      region: "EAST_CRIMEA",
    });
  });

  it("accepts an empty query", () => {
    expect(beachCatalogQuerySchema.parse({})).toEqual({});
  });

  it.each([
    { q: "Ялта" },
    { region: "UNKNOWN_REGION" },
    { locality: "Ялта" },
    { surface: "SAND" },
  ])("rejects unsupported query $q", (query) => {
    expect(beachCatalogQuerySchema.safeParse(query).success).toBe(false);
  });

  it("accepts available region options", () => {
    const response = {
      data: {
        regions: ["WEST_CRIMEA", "SOUTH_COAST"],
      },
    } as const;

    expect(beachCatalogFilterOptionsSchema.parse(response)).toEqual(response);
  });
});
