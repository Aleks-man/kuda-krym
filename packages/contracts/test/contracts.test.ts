import { describe, expect, it } from "vitest";

import {
  apiErrorSchema,
  beachListResponseSchema,
  healthResponseSchema,
} from "../src/index.js";

describe("API contracts", () => {
  it("accepts a valid health response", () => {
    expect(healthResponseSchema.parse({ status: "ok" })).toEqual({
      status: "ok",
    });
  });

  it("rejects an empty API error code", () => {
    const result = apiErrorSchema.safeParse({
      error: { code: "", message: "Request failed" },
    });

    expect(result.success).toBe(false);
  });

  it("accepts a beach list response", () => {
    const result = beachListResponseSchema.parse({
      data: [
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
      ],
      meta: { total: 1 },
    });

    expect(result.meta.total).toBe(1);
  });
});

