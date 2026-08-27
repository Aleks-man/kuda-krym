import { describe, expect, it } from "vitest";

import { createForecastCacheKey } from "../../../src/shared/cache/forecast-cache-key.js";
import { forecastCacheTtlSeconds } from "../../../src/shared/cache/forecast-cache-policy.js";

describe("forecast cache key", () => {
  it("creates a stable key from source, normalized coordinates and horizon", () => {
    expect(
      createForecastCacheKey(
        "weather",
        { latitude: 44.952116, longitude: 34.102411 },
        2,
      ),
    ).toBe("forecast:weather:44.9521,34.1024:days:2");
  });

  it("keeps different forecast sources in separate namespaces", () => {
    const coordinates = { latitude: 44.95, longitude: 34.1 };

    expect(createForecastCacheKey("weather", coordinates, 2)).not.toBe(
      createForecastCacheKey("marine", coordinates, 2),
    );
  });

  it("defines a positive TTL for every forecast source", () => {
    expect(Object.values(forecastCacheTtlSeconds).every((ttl) => ttl > 0)).toBe(
      true,
    );
  });
});
