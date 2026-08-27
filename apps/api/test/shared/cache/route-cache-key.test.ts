import { describe, expect, it } from "vitest";

import { createRouteCacheKey } from "../../../src/shared/cache/route-cache-key.js";

describe("route cache key", () => {
  it("normalizes both endpoints in travel direction", () => {
    const origin = { latitude: 44.952103, longitude: 34.102397 };
    const destination = { latitude: 44.644844, longitude: 33.536119 };

    expect(createRouteCacheKey(origin, destination)).toBe(
      "route:driving:44.95210,34.10240:44.64484,33.53612",
    );
    expect(createRouteCacheKey(origin, destination)).not.toBe(
      createRouteCacheKey(destination, origin),
    );
  });
});
