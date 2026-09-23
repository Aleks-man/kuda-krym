import { describe, expect, it } from "vitest";
import type { CoastalLocation } from "@kuda-krym/contracts";
import { getForecastPlaceOptions } from "./forecast-place-options";

const locations = [{ id: "coast-yalta", name: "Ялта", slug: "yalta", region: "SOUTH_COAST", waterBody: "BLACK_SEA" }] as CoastalLocation[];

describe("forecast place options", () => {
  it("includes the city alongside coastal places", () => {
    expect(getForecastPlaceOptions(locations, "").map(option => option.href)).toEqual(["/cities/simferopol", "/coast/yalta"]);
  });
  it("finds Simferopol by name without assigning marine data", () => {
    expect(getForecastPlaceOptions(locations, " СИМФЕР ")).toEqual([expect.objectContaining({ name: "Симферополь", href: "/cities/simferopol", detail: "Городской прогноз погоды" })]);
    expect(getForecastPlaceOptions(locations, "ялт")).toEqual([expect.objectContaining({ href: "/coast/yalta" })]);
    expect(getForecastPlaceOptions(locations, "unknown")).toEqual([]);
  });
});
