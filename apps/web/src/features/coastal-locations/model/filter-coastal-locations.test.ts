import { describe, expect, it } from "vitest";
import type { CoastalLocation } from "@kuda-krym/contracts";

import { filterCoastalLocations } from "./filter-coastal-locations";

const locations = [
  { name: "Николаевка", slug: "nikolaevka" },
  { name: "Севастополь", slug: "sevastopol" },
] as CoastalLocation[];

describe("filterCoastalLocations", () => {
  it("returns all locations for an empty query", () => {
    expect(filterCoastalLocations(locations, " ")).toEqual(locations);
  });

  it("matches a location by a case-insensitive name fragment", () => {
    expect(filterCoastalLocations(locations, "НИКОЛ")).toEqual([locations[0]]);
  });
});