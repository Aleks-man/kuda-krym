import { describe, expect, it } from "vitest";

import { InMemoryCacheStore } from "../../../src/shared/cache/in-memory-cache.store.js";

describe("InMemoryCacheStore", () => {
  it("returns a stored value before it expires", async () => {
    const cache = new InMemoryCacheStore(() => 1_000);

    await cache.set("forecast:test", { temperature: 24 }, 60);

    await expect(cache.get("forecast:test")).resolves.toEqual({ temperature: 24 });
  });

  it("removes an expired value", async () => {
    let now = 1_000;
    const cache = new InMemoryCacheStore(() => now);
    await cache.set("forecast:test", "value", 10);

    now = 11_000;

    await expect(cache.get("forecast:test")).resolves.toBeNull();
    await expect(cache.get("forecast:test")).resolves.toBeNull();
  });

  it("overwrites an existing value and expiration", async () => {
    let now = 1_000;
    const cache = new InMemoryCacheStore(() => now);
    await cache.set("forecast:test", "old", 1);
    await cache.set("forecast:test", "new", 20);

    now = 3_000;

    await expect(cache.get("forecast:test")).resolves.toBe("new");
  });

  it("deletes a stored value", async () => {
    const cache = new InMemoryCacheStore();
    await cache.set("forecast:test", "value", 60);

    await cache.delete("forecast:test");

    await expect(cache.get("forecast:test")).resolves.toBeNull();
  });

  it("rejects a non-positive TTL", async () => {
    const cache = new InMemoryCacheStore();

    await expect(cache.set("forecast:test", "value", 0)).rejects.toThrow(
      "Cache TTL must be a positive number of seconds",
    );
  });
});
