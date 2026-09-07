import { describe, expect, it } from "vitest";

import {
  departureLocationSearchQuerySchema,
  departureLocationSearchResponseSchema,
} from "../src/index.js";

describe("departure location search contracts", () => {
  it("normalizes a valid search query", () => {
    expect(
      departureLocationSearchQuerySchema.parse({ query: "  Нико  " }),
    ).toEqual({ query: "Нико" });
  });

  it("rejects a query shorter than two characters", () => {
    expect(() =>
      departureLocationSearchQuerySchema.parse({ query: "Н" }),
    ).toThrow();
  });

  it("accepts location suggestions with coordinates", () => {
    const result = departureLocationSearchResponseSchema.parse({
      data: [
        {
          id: "osm:node:123",
          name: "Николаевка",
          context: "Симферопольский район",
          latitude: 44.966,
          longitude: 33.614,
        },
      ],
    });

    expect(result.data[0]?.name).toBe("Николаевка");
  });

  it("rejects coordinates outside geographic bounds", () => {
    expect(() =>
      departureLocationSearchResponseSchema.parse({
        data: [
          {
            id: "invalid",
            name: "Ошибка",
            context: "",
            latitude: 95,
            longitude: 33,
          },
        ],
      }),
    ).toThrow();
  });
});
