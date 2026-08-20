import { beachListResponseSchema } from "@kuda-krym/contracts";
import request from "supertest";
import { describe, expect, it } from "vitest";

import { createTestApp } from "./support/create-test-app.js";

describe("GET /api/beaches", () => {
  it("returns published beaches", async () => {
    const app = createTestApp([
      {
        id: "47f72fb6-dd75-4ca2-9f78-ad1e594dbcb4",
        slug: "uchkuevka",
        name: "Пляж Учкуевка",
        region: "SEVASTOPOL",
        locality: "Севастополь",
        coordinates: { latitude: 44.644844, longitude: 33.536119 },
        surface: "UNKNOWN",
        childSuitability: "UNKNOWN",
        coverImageUrl: null,
      },
    ]);

    const response = await request(app).get("/api/beaches");
    const body = beachListResponseSchema.parse(response.body);

    expect(response.status).toBe(200);
    expect(body.meta.total).toBe(1);
    expect(body.data[0]?.slug).toBe("uchkuevka");
  });
});
