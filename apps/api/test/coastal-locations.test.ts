import {
  coastalLocationListResponseSchema,
  coastalLocationSchema,
} from "@kuda-krym/contracts";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createTestApp } from "./support/create-test-app.js";

const yalta = {
  id: "47f72fb6-dd75-4ca2-9f78-ad1e594dbcb4",
  slug: "yalta",
  name: "Ялта",
  region: "SOUTH_COAST",
  waterBody: "BLACK_SEA",
  weatherCoordinates: { latitude: 44.495, longitude: 34.166 },
  marineCoordinates: { latitude: 44.46, longitude: 34.17 },
  coverImage: {
    url: "/images/places/yalta-beach-2016.webp",
    alt: "Yalta coast",
    title: "Yalta beach",
    author: "Example author",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Yalta.jpg",
  },
} as const;

describe("coastal locations API", () => {
  it("returns published coastal locations", async () => {
    const response = await request(
      createTestApp({ coastalLocations: [yalta] }),
    ).get("/api/coastal-locations");

    expect(response.status).toBe(200);
    expect(coastalLocationListResponseSchema.parse(response.body)).toEqual({
      data: [yalta],
      meta: { total: 1 },
    });
  });

  it("returns a coastal location by slug", async () => {
    const response = await request(
      createTestApp({ coastalLocations: [yalta] }),
    ).get("/api/coastal-locations/yalta");

    expect(response.status).toBe(200);
    expect(coastalLocationSchema.parse(response.body).slug).toBe("yalta");
  });

  it("returns 404 for an unavailable coastal location", async () => {
    const response = await request(createTestApp()).get(
      "/api/coastal-locations/unknown",
    );

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("COASTAL_LOCATION_NOT_FOUND");
  });
});
