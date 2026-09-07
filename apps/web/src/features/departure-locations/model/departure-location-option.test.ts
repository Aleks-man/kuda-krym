import { describe, expect, it } from "vitest";

import {
  getPopularDepartureLocations,
  mergeDepartureLocationOptions,
} from "./departure-location-option";

describe("departure location options", () => {
  it("filters popular locations by a partial name", () => {
    expect(getPopularDepartureLocations("симф")[0]).toMatchObject({
      label: "Симферополь",
      value: "simferopol",
    });
  });

  it("adds searched settlements without duplicating popular cities", () => {
    const result = mergeDepartureLocationOptions(
      getPopularDepartureLocations("Ялта"),
      [
        {
          id: "osm:N:1",
          name: "Ялта",
          context: "Крым",
          latitude: 44.5,
          longitude: 34.16,
        },
        {
          id: "osm:N:2",
          name: "Ялтинское",
          context: "Крым",
          latitude: 45,
          longitude: 34,
        },
      ],
    );

    expect(result.map(({ label }) => label)).toEqual(["Ялта", "Ялтинское"]);
  });
});
