import { routeResponseSchema } from "@kuda-krym/contracts";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createTestApp } from "./support/create-test-app.js";

const beachId = "47f72fb6-dd75-4ca2-9f78-ad1e594dbcb4";
const validRequest = {
  origin: { latitude: 44.9521, longitude: 34.1024 },
  beachId,
  profile: "DRIVING",
};
const drivingRoute = {
  origin: validRequest.origin,
  destination: { latitude: 44.644844, longitude: 33.536119 },
  distanceMeters: 78_240,
  durationSeconds: 4_380,
  geometry: {
    type: "LineString" as const,
    coordinates: [
      [34.1024, 44.9521],
      [33.536119, 44.644844],
    ] as [number, number][],
  },
  source: "OSRM" as const,
  calculatedAt: "2026-08-25T08:00:00.000Z",
};

describe("POST /api/routes", () => {
  it("returns a calculated driving route", async () => {
    const response = await request(createTestApp({ drivingRoute }))
      .post("/api/routes")
      .send(validRequest);

    expect(response.status).toBe(200);
    expect(routeResponseSchema.parse(response.body)).toMatchObject({
      data: { distanceMeters: 78_240, durationSeconds: 4_380 },
      meta: { source: "OSRM", cached: false },
    });
  });

  it("rejects invalid coordinates and additional fields", async () => {
    const response = await request(createTestApp())
      .post("/api/routes")
      .send({
        ...validRequest,
        origin: { latitude: 144.9521, longitude: 34.1024 },
        debug: true,
      });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("INVALID_ROUTE_REQUEST");
  });

  it("returns 404 for an unavailable beach", async () => {
    const response = await request(createTestApp())
      .post("/api/routes")
      .send(validRequest);

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("BEACH_NOT_FOUND");
  });

  it("hides routing provider failures", async () => {
    const response = await request(
      createTestApp({ routingError: new Error("OSRM internal response") }),
    )
      .post("/api/routes")
      .send(validRequest);

    expect(response.status).toBe(502);
    expect(response.body).toEqual({
      error: {
        code: "ROUTING_PROVIDER_UNAVAILABLE",
        message: "Не удалось построить маршрут",
      },
    });
  });
});
