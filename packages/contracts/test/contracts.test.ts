import { describe, expect, it } from "vitest";

import { apiErrorSchema, healthResponseSchema } from "../src/index.js";

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
});

