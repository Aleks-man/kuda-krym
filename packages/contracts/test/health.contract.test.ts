import {
  healthResponseSchema,
  readinessResponseSchema,
} from "../src/index.js";
import { describe, expect, it } from "vitest";

describe("health contracts", () => {
  it("accepts the liveness response", () => {
    expect(healthResponseSchema.parse({ status: "ok" })).toEqual({
      status: "ok",
    });
  });

  it.each([
    { status: "ready", checks: { database: "up" } },
    { status: "not_ready", checks: { database: "down" } },
  ] as const)("accepts readiness status $status", (response) => {
    expect(readinessResponseSchema.parse(response)).toEqual(response);
  });
});
