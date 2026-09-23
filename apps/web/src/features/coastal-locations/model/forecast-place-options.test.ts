import { describe, expect, it } from "vitest";
import { inlandForecastLocations, type CoastalLocation } from "@kuda-krym/contracts";
import { getForecastPlaceOptions } from "./forecast-place-options";

const locations = [{ id: "coast-yalta", name: "Ялта", slug: "yalta", region: "SOUTH_COAST", waterBody: "BLACK_SEA" }] as CoastalLocation[];

describe("forecast place options", () => {
  it("includes the city alongside coastal places", () => {
    const options = getForecastPlaceOptions(locations, "");
    expect(options).toHaveLength(inlandForecastLocations.length + 1);
    expect(options.map(option => option.href)).toContain("/coast/yalta");
  });
  it("finds Simferopol by name without assigning marine data", () => {
    expect(getForecastPlaceOptions(locations, " СИМФЕР ")).toContainEqual(expect.objectContaining({ name: "Симферополь", href: "/cities/simferopol", detail: "Городской округ Симферополь" }));
    expect(getForecastPlaceOptions(locations, "ялт")).toEqual([expect.objectContaining({ href: "/coast/yalta" })]);
    expect(getForecastPlaceOptions(locations, "unknown")).toEqual([]);
  });
});

it.each(inlandForecastLocations)("finds $name and routes to its own forecast", (city) => {
  expect(getForecastPlaceOptions(locations, city.name)).toContainEqual(expect.objectContaining({ name: city.name, href: `/cities/${city.slug}` }));
});

it("disambiguates Pervomayskoye with its district", () => {
  expect(getForecastPlaceOptions([], "Первомайское")).toEqual([expect.objectContaining({ href: "/cities/pervomayskoye", detail: "Первомайский район" })]);
  expect(getForecastPlaceOptions([], "Кировский район")).toEqual([expect.objectContaining({ name: "Старый Крым" })]);
});
