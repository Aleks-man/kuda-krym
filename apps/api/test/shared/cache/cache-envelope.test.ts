import { describe, expect, it } from "vitest";

import {
  createCacheEnvelope,
  getCacheAgeSeconds,
  getCacheFreshness,
  parseCacheEnvelope,
} from "../../../src/shared/cache/cache-envelope.js";
import {
  forecastCacheRetentionSeconds,
  forecastCacheTtlSeconds,
} from "../../../src/shared/cache/forecast-cache-policy.js";

describe("cache envelope", () => {
  it("stores the creation time and freshness boundary", () => {
    const envelope = createCacheEnvelope({ temperature: 24 }, 900, () =>
      new Date("2026-08-27T08:00:00.000Z"),
    );

    expect(envelope).toEqual({
      value: { temperature: 24 },
      storedAt: "2026-08-27T08:00:00.000Z",
      freshUntil: "2026-08-27T08:15:00.000Z",
    });
  });

  it("distinguishes fresh and stale data at the boundary", () => {
    const envelope = createCacheEnvelope("forecast", 900, () =>
      new Date("2026-08-27T08:00:00.000Z"),
    );

    expect(
      getCacheFreshness(envelope, new Date("2026-08-27T08:14:59.999Z")),
    ).toBe("FRESH");
    expect(
      getCacheFreshness(envelope, new Date("2026-08-27T08:15:00.000Z")),
    ).toBe("STALE");
  });

  it("calculates a non-negative age in whole seconds", () => {
    const envelope = createCacheEnvelope("forecast", 900, () =>
      new Date("2026-08-27T08:00:00.000Z"),
    );

    expect(
      getCacheAgeSeconds(envelope, new Date("2026-08-27T08:02:05.900Z")),
    ).toBe(125);
    expect(
      getCacheAgeSeconds(envelope, new Date("2026-08-27T07:59:00.000Z")),
    ).toBe(0);
  });

  it("validates envelopes read from an external cache", () => {
    expect(
      parseCacheEnvelope({
        value: "forecast",
        storedAt: "2026-08-27T08:00:00.000Z",
        freshUntil: "2026-08-27T08:15:00.000Z",
      }),
    ).toMatchObject({ value: "forecast" });

    expect(() =>
      parseCacheEnvelope({ value: "forecast", storedAt: "invalid" }),
    ).toThrow("Cache storedAt must be an ISO date string");
  });

  it("rejects invalid freshness configuration", () => {
    expect(() => createCacheEnvelope("forecast", 0)).toThrow(
      "Cache freshness TTL must be a positive number of seconds",
    );
  });

  it("retains every forecast longer than its freshness TTL", () => {
    for (const source of Object.keys(forecastCacheTtlSeconds) as Array<
      keyof typeof forecastCacheTtlSeconds
    >) {
      expect(forecastCacheRetentionSeconds[source]).toBeGreaterThan(
        forecastCacheTtlSeconds[source],
      );
    }
  });
});
