import { describe, expect, it } from "vitest";

import { parseRecommendationOrigin } from "./recommendation-origin";

describe("parseRecommendationOrigin", () => {
  it("accepts a popular location code", () => {
    expect(parseRecommendationOrigin("simferopol")).toBe("simferopol");
  });

  it("accepts a serialized searched location", () => {
    const origin = {
      id: "osm:N:100",
      name: "Николаевка",
      context: "Симферопольский район · Крым",
      latitude: 44.966,
      longitude: 33.614,
    };

    expect(parseRecommendationOrigin(JSON.stringify(origin))).toEqual(origin);
  });

  it("requires a location selected from suggestions", () => {
    expect(() => parseRecommendationOrigin("")).toThrow(
      "Выберите населённый пункт из списка",
    );
    expect(() => parseRecommendationOrigin("неизвестное место")).toThrow(
      "Выберите населённый пункт из списка",
    );
  });
});
