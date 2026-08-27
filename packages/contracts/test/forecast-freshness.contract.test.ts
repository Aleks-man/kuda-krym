import { describe, expect, it } from "vitest";

import {
  forecastFreshnessSchema,
  forecastSourceFreshnessSchema,
} from "../src/index.js";

describe("forecast freshness contracts", () => {
  it("accepts freshness for every forecast source", () => {
    const freshness = forecastFreshnessSchema.parse({
      status: "STALE",
      sources: {
        weather: {
          status: "STALE",
          generatedAt: "2026-08-27T06:00:00.000Z",
        },
        marine: {
          status: "FRESH",
          generatedAt: "2026-08-27T07:00:00.000Z",
        },
        weatherModels: null,
      },
    });

    expect(freshness.status).toBe("STALE");
    expect(freshness.sources.weather.status).toBe("STALE");
  });

  it("rejects an unknown freshness status", () => {
    const result = forecastSourceFreshnessSchema.safeParse({
      status: "UNKNOWN",
      generatedAt: "2026-08-27T07:00:00.000Z",
    });

    expect(result.success).toBe(false);
  });
});
