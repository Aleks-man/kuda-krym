import { describe, expect, it } from "vitest";

import {
  beachCatalogFilterOptionsSchema,
  beachCatalogQuerySchema,
} from "../src/index.js";

describe("beach catalog filter contracts", () => {
  it("normalizes supported catalog filters", () => {
    expect(
      beachCatalogQuerySchema.parse({
        q: "  золотой пляж ",
        region: "EAST_CRIMEA",
        locality: " Береговое ",
      }),
    ).toEqual({
      q: "золотой пляж",
      region: "EAST_CRIMEA",
      locality: "Береговое",
    });
  });

  it("accepts an empty query", () => {
    expect(beachCatalogQuerySchema.parse({})).toEqual({});
  });

  it.each([
    { q: "" },
    { q: "a".repeat(101) },
    { region: "UNKNOWN_REGION" },
    { locality: "   " },
    { surface: "SAND" },
  ])("rejects unsupported query $q", (query) => {
    expect(beachCatalogQuerySchema.safeParse(query).success).toBe(false);
  });

  it("accepts available region and locality options", () => {
    const response = {
      data: {
        regions: ["WEST_CRIMEA", "SOUTH_COAST"],
        localities: ["Евпатория", "Ялта"],
      },
    } as const;

    expect(beachCatalogFilterOptionsSchema.parse(response)).toEqual(response);
  });
});
