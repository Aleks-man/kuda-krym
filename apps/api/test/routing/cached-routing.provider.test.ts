import { describe, expect, it, vi } from "vitest";

import { CachedRoutingProvider } from "../../src/modules/routing/cache/cached-routing.provider.js";
import type { DrivingRoute, RoutingProvider } from "../../src/modules/routing/route.js";
import type { CacheStore } from "../../src/shared/cache/cache-store.js";
import { routeCacheTtlSeconds } from "../../src/shared/cache/route-cache-policy.js";

const request = {
  origin: { latitude: 44.9521, longitude: 34.1024 },
  destination: { latitude: 44.644844, longitude: 33.536119 },
};

const route: DrivingRoute = {
  ...request,
  distanceMeters: 78_240,
  durationSeconds: 4_380,
  geometry: {
    type: "LineString",
    coordinates: [
      [34.1024, 44.9521],
      [33.536119, 44.644844],
    ],
  },
  source: "OSRM",
  calculatedAt: "2026-08-27T08:00:00.000Z",
};

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
    getDrivingRoute: vi.fn<RoutingProvider["getDrivingRoute"]>(),
  };
  return { cache, cacheGet, cacheSet, provider };
}

describe("CachedRoutingProvider", () => {
  it("returns a cached route without calling OSRM", async () => {
    const { cache, cacheGet, provider } = createDependencies();
    cacheGet.mockResolvedValue(route);
    const cachedProvider = new CachedRoutingProvider({ cache, provider });

    await expect(cachedProvider.getDrivingRoute(request)).resolves.toMatchObject({
      cached: true,
      durationSeconds: 4_380,
    });
    expect(provider.getDrivingRoute).not.toHaveBeenCalled();
  });

  it("loads, caches and marks a fresh OSRM route", async () => {
    const { cache, cacheGet, cacheSet, provider } = createDependencies();
    cacheGet.mockResolvedValue(null);
    provider.getDrivingRoute.mockResolvedValue(route);
    const cachedProvider = new CachedRoutingProvider({ cache, provider });

    await expect(cachedProvider.getDrivingRoute(request)).resolves.toMatchObject({
      cached: false,
    });

    expect(cacheSet).toHaveBeenCalledWith(
      "route:driving:44.95210,34.10240:44.64484,33.53612",
      route,
      routeCacheTtlSeconds,
    );
  });

  it("uses OSRM when reading Redis fails", async () => {
    const { cache, cacheGet, provider } = createDependencies();
    const onCacheError = vi.fn();
    cacheGet.mockRejectedValue(new Error("Redis unavailable"));
    provider.getDrivingRoute.mockResolvedValue(route);
    const cachedProvider = new CachedRoutingProvider({
      cache,
      provider,
      onCacheError,
    });

    await expect(cachedProvider.getDrivingRoute(request)).resolves.toMatchObject({
      cached: false,
    });
    expect(onCacheError).toHaveBeenCalledOnce();
  });

  it("returns the fresh route when writing Redis fails", async () => {
    const { cache, cacheGet, cacheSet, provider } = createDependencies();
    cacheGet.mockResolvedValue(null);
    cacheSet.mockRejectedValue(new Error("Redis unavailable"));
    provider.getDrivingRoute.mockResolvedValue(route);

    await expect(
      new CachedRoutingProvider({ cache, provider }).getDrivingRoute(request),
    ).resolves.toMatchObject({ cached: false });
  });
});
