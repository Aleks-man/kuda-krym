import {
  departureLocationSearchResponseSchema,
  type DepartureLocation,
} from "@kuda-krym/contracts";
import request from "supertest";
import { describe, expect, it } from "vitest";

import { createTestApp } from "./support/create-test-app.js";

const nikolaevka: DepartureLocation = {
  id: "osm:N:100",
  name: "Николаевка",
  context: "Симферопольский район · Крым",
  latitude: 44.966,
  longitude: 33.614,
};

describe("departure locations API", () => {
  it("returns matching settlement suggestions", async () => {
    const response = await request(
      createTestApp({ departureLocations: [nikolaevka] }),
    ).get("/api/departure-locations?query=Нико");

    expect(response.status).toBe(200);
    expect(departureLocationSearchResponseSchema.parse(response.body)).toEqual({
      data: [nikolaevka],
    });
  });

  it("rejects a query shorter than two characters", async () => {
    const response = await request(createTestApp()).get(
      "/api/departure-locations?query=Н",
    );

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe(
      "INVALID_DEPARTURE_LOCATION_QUERY",
    );
  });

  it("reports an unavailable location provider", async () => {
    const response = await request(
      createTestApp({
        departureLocationError: new Error("Photon unavailable"),
      }),
    ).get("/api/departure-locations?query=Нико");

    expect(response.status).toBe(502);
    expect(response.body.error.code).toBe("LOCATION_PROVIDER_UNAVAILABLE");
  });
});
