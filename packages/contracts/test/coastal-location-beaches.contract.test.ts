import { describe, expect, it } from "vitest";

import { coastalLocationBeachesResponseSchema } from "../src/index.js";

describe("coastal location beaches contract", () => {
  it("accepts a coastal location with its published beaches", () => {
    const response = coastalLocationBeachesResponseSchema.parse({
      location: {
        id: "47f72fb6-dd75-4ca2-9f78-ad1e594dbcb4",
        slug: "sudak",
        name: "Судак",
        region: "EAST_CRIMEA",
        waterBody: "BLACK_SEA",
        weatherCoordinates: { latitude: 44.85, longitude: 34.97 },
        marineCoordinates: { latitude: 44.83, longitude: 34.98 },
        coverImage: null,
      },
      data: [
        {
          id: "477a1c52-80df-4755-8a80-f32c895d19e3",
          slug: "sudak-central",
          name: "Центральный городской пляж Судака",
          region: "EAST_CRIMEA",
          locality: "Судак",
          coordinates: { latitude: 44.839935, longitude: 34.973753 },
          surface: "UNKNOWN",
          childSuitability: "UNKNOWN",
          coverImage: null,
        },
      ],
      meta: { total: 1 },
    });

    expect(response.location.slug).toBe("sudak");
    expect(response.data[0]?.slug).toBe("sudak-central");
  });
});
