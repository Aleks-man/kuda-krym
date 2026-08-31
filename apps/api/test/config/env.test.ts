import { describe, expect, it } from "vitest";

import { parseEnv } from "../../src/config/env.js";

describe("API environment", () => {
  it("uses the local Redis address by default", () => {
    const env = parseEnv({ NODE_ENV: "test" });

    expect(env.REDIS_URL).toBe("redis://127.0.0.1:6379");
  });

  it("accepts a configured Redis address", () => {
    const env = parseEnv({
      NODE_ENV: "production",
      REDIS_URL: "rediss://cache.example.com:6380",
    });

    expect(env.REDIS_URL).toBe("rediss://cache.example.com:6380");
  });

  it("rejects an invalid Redis address", () => {
    expect(() => parseEnv({ REDIS_URL: "not-a-url" })).toThrow();
  });

  it("uses conservative rate limit defaults", () => {
    const env = parseEnv({ NODE_ENV: "test" });

    expect(env.RATE_LIMIT_WINDOW_SECONDS).toBe(60);
    expect(env.RATE_LIMIT_MAX_REQUESTS).toBe(120);
    expect(env.RATE_LIMIT_EXPENSIVE_MAX_REQUESTS).toBe(10);
  });

  it("accepts configured rate limits", () => {
    const env = parseEnv({
      RATE_LIMIT_WINDOW_SECONDS: "300",
      RATE_LIMIT_MAX_REQUESTS: "500",
      RATE_LIMIT_EXPENSIVE_MAX_REQUESTS: "25",
    });

    expect(env.RATE_LIMIT_WINDOW_SECONDS).toBe(300);
    expect(env.RATE_LIMIT_MAX_REQUESTS).toBe(500);
    expect(env.RATE_LIMIT_EXPENSIVE_MAX_REQUESTS).toBe(25);
  });

  it("rejects an expensive limit above the global limit", () => {
    expect(() =>
      parseEnv({
        RATE_LIMIT_MAX_REQUESTS: "5",
        RATE_LIMIT_EXPENSIVE_MAX_REQUESTS: "6",
      }),
    ).toThrow(
      "RATE_LIMIT_EXPENSIVE_MAX_REQUESTS must not exceed RATE_LIMIT_MAX_REQUESTS",
    );
  });

  it("does not trust reverse proxies by default", () => {
    expect(parseEnv({ NODE_ENV: "production" }).TRUST_PROXY_HOPS).toBe(0);
  });

  it("accepts a bounded number of trusted proxy hops", () => {
    expect(parseEnv({ TRUST_PROXY_HOPS: "1" }).TRUST_PROXY_HOPS).toBe(1);
    expect(() => parseEnv({ TRUST_PROXY_HOPS: "11" })).toThrow();
  });
});
