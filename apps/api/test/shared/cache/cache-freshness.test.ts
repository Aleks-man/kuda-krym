import { describe, expect, it } from "vitest";

import {
  getDataFreshness,
  markDataFreshness,
} from "../../../src/shared/cache/cache-freshness.js";

const forecast = {
  generatedAt: "2026-08-27T08:00:00.000Z",
  hourly: [],
};

describe("cache freshness metadata", () => {
  it("marks data without mutating the original value", () => {
    const marked = markDataFreshness(forecast, "STALE");

    expect(marked).toEqual({
      ...forecast,
      freshness: {
        status: "STALE",
        generatedAt: forecast.generatedAt,
      },
    });
    expect(forecast).not.toHaveProperty("freshness");
  });

  it("treats unmarked upstream data as fresh", () => {
    expect(getDataFreshness(forecast)).toEqual({
      status: "FRESH",
      generatedAt: forecast.generatedAt,
    });
  });
});
