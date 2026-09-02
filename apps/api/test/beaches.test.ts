import {
  beachCatalogFilterOptionsSchema,
  beachDetailSchema,
  beachListResponseSchema,
} from "@kuda-krym/contracts";
import request from "supertest";
import { describe, expect, it } from "vitest";

import { createTestApp } from "./support/create-test-app.js";

describe("GET /api/beaches", () => {
  it("returns published beaches", async () => {
    const app = createTestApp({
      beaches: [
        {
          id: "47f72fb6-dd75-4ca2-9f78-ad1e594dbcb4",
          slug: "uchkuevka",
          name: "Пляж Учкуевка",
          region: "SEVASTOPOL",
          locality: "Севастополь",
          coordinates: { latitude: 44.644844, longitude: 33.536119 },
          surface: "UNKNOWN",
          childSuitability: "UNKNOWN",
          coverImage: null,
        },
      ],
    });

    const response = await request(app).get("/api/beaches");
    const body = beachListResponseSchema.parse(response.body);

    expect(response.status).toBe(200);
    expect(body.meta.total).toBe(1);
    expect(body.data[0]?.slug).toBe("uchkuevka");
  });

  it("filters beaches by search, region and locality", async () => {
    const app = createTestApp({
      beaches: [
        createBeach({
          slug: "yalta-city",
          name: "Городской пляж Ялты",
          region: "SOUTH_COAST",
          locality: "Ялта",
        }),
        createBeach({
          slug: "omega",
          name: "Пляж Омега",
          region: "SEVASTOPOL",
          locality: "Севастополь",
        }),
      ],
    });

    const response = await request(app).get("/api/beaches").query({
      q: "ялт",
      region: "SOUTH_COAST",
      locality: "ялта",
    });
    const body = beachListResponseSchema.parse(response.body);

    expect(response.status).toBe(200);
    expect(body.meta.total).toBe(1);
    expect(body.data.map(({ slug }) => slug)).toEqual(["yalta-city"]);
  });

  it("rejects unsupported catalog parameters", async () => {
    const response = await request(createTestApp())
      .get("/api/beaches")
      .query({ surface: "SAND" });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("INVALID_BEACH_CATALOG_QUERY");
  });

  it("returns filters available for published beaches", async () => {
    const app = createTestApp({
      beaches: [
        createBeach({
          slug: "yalta-city",
          name: "Городской пляж Ялты",
          region: "SOUTH_COAST",
          locality: "Ялта",
        }),
        createBeach({
          slug: "omega",
          name: "Пляж Омега",
          region: "SEVASTOPOL",
          locality: "Севастополь",
        }),
      ],
    });

    const response = await request(app).get("/api/beaches/filter-options");
    const body = beachCatalogFilterOptionsSchema.parse(response.body);

    expect(response.status).toBe(200);
    expect(body.data.regions).toEqual(["SOUTH_COAST", "SEVASTOPOL"]);
    expect(body.data.localities).toEqual(["Ялта", "Севастополь"]);
  });

  it("returns a published beach by slug", async () => {
    const app = createTestApp({
      details: [
        {
          id: "47f72fb6-dd75-4ca2-9f78-ad1e594dbcb4",
          slug: "uchkuevka",
          name: "Пляж Учкуевка",
          officialName: "Учкуевка",
          description: null,
          region: "SEVASTOPOL",
          locality: "Севастополь",
          coordinates: { latitude: 44.644844, longitude: 33.536119 },
          surface: "UNKNOWN",
          childSuitability: "UNKNOWN",
          coverImage: null,
          profile: {
            waterEntry: "UNKNOWN",
            childSuitability: "UNKNOWN",
            infrastructure: "UNKNOWN",
            parking: "UNKNOWN",
            accessibility: "UNKNOWN",
            bayProtection: "UNKNOWN",
            hasToilet: "UNKNOWN",
            hasShower: "UNKNOWN",
            hasChangingRoom: "UNKNOWN",
          },
          images: [],
          sources: [],
        },
      ],
    });

    const response = await request(app).get("/api/beaches/uchkuevka");
    const body = beachDetailSchema.parse(response.body);

    expect(response.status).toBe(200);
    expect(body.slug).toBe("uchkuevka");
  });

  it("returns 404 for an unknown beach", async () => {
    const response = await request(createTestApp()).get(
      "/api/beaches/missing-beach",
    );

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: { code: "BEACH_NOT_FOUND", message: "Пляж не найден" },
    });
  });
});

function createBeach(
  overrides: Readonly<{
    slug: string;
    name: string;
    region: "SOUTH_COAST" | "SEVASTOPOL";
    locality: string;
  }>,
) {
  return {
    id:
      overrides.slug === "omega"
        ? "de19fc20-cc50-4db8-95d0-48e4046a9700"
        : "47f72fb6-dd75-4ca2-9f78-ad1e594dbcb4",
    coordinates: { latitude: 44.5, longitude: 34.1 },
    surface: "UNKNOWN" as const,
    childSuitability: "UNKNOWN" as const,
    coverImage: null,
    ...overrides,
  };
}
