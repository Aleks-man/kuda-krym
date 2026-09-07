import { describe, expect, it, vi } from "vitest";

import { CachedDepartureLocationProvider } from "../../src/modules/departure-locations/cache/cached-departure-location.provider.js";
import { departureLocationCacheTtlSeconds } from "../../src/modules/departure-locations/cache/departure-location-cache.policy.js";
import type { DepartureLocationProvider } from "../../src/modules/departure-locations/departure-location.provider.js";
import type { CacheStore } from "../../src/shared/cache/cache-store.js";

const locations = [
  {
    id: "osm:N:100",
    name: "Николаевка",
    context: "Симферопольский район · Крым",
    latitude: 44.966,
    longitude: 33.614,
  },
];

function createDependencies() {
  const cacheGet = vi.fn<(key: string) => Promise<unknown | null>>();
  const cacheSet = vi.fn(
    async (_key: string, _value: unknown, _ttlSeconds: number) => undefined,
  );
  const cache: CacheStore = {
    async get<T>(key: string) {
      return (await cacheGet(key)) as T | null;
    },
    async set<T>(key: string, value: T, ttlSeconds: number) {
      await cacheSet(key, value, ttlSeconds);
    },
    delete: vi.fn<CacheStore["delete"]>(),
  };
  const provider = {
    search: vi.fn<DepartureLocationProvider["search"]>(),
  };

  return { cache, cacheGet, cacheSet, provider };
}

describe("CachedDepartureLocationProvider", () => {
  it("returns cached suggestions without calling Photon", async () => {
    const { cache, cacheGet, provider } = createDependencies();
    cacheGet.mockResolvedValue(locations);

    await expect(
      new CachedDepartureLocationProvider({ cache, provider }).search("Нико"),
    ).resolves.toEqual(locations);
    expect(provider.search).not.toHaveBeenCalled();
  });

  it("normalizes the key and caches fresh suggestions", async () => {
    const { cache, cacheGet, cacheSet, provider } = createDependencies();
    cacheGet.mockResolvedValue(null);
    provider.search.mockResolvedValue(locations);

    const cachedProvider = new CachedDepartureLocationProvider({
      cache,
      provider,
    });
    await cachedProvider.search("  НИКО  ");

    expect(provider.search).toHaveBeenCalledWith("НИКО");
    expect(cacheSet).toHaveBeenCalledWith(
      "departure-location:search:%D0%BD%D0%B8%D0%BA%D0%BE",
      locations,
      departureLocationCacheTtlSeconds,
    );
  });

  it("continues searching when Redis is unavailable", async () => {
    const { cache, cacheGet, provider } = createDependencies();
    const onCacheError = vi.fn();
    cacheGet.mockRejectedValue(new Error("Redis unavailable"));
    provider.search.mockResolvedValue(locations);

    await expect(
      new CachedDepartureLocationProvider({
        cache,
        provider,
        onCacheError,
      }).search("Нико"),
    ).resolves.toEqual(locations);
    expect(onCacheError).toHaveBeenCalledOnce();
  });
});
