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
});
