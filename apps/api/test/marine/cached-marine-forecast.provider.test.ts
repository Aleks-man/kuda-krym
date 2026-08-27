import { describe, expect, it, vi } from "vitest";

import { CachedMarineForecastProvider } from "../../src/modules/marine/cache/cached-marine-forecast.provider.js";
import type {
  MarineForecast,
  MarineForecastProvider,
} from "../../src/modules/marine/marine-forecast.js";
import type { CacheStore } from "../../src/shared/cache/cache-store.js";
import { forecastCacheRetentionSeconds } from "../../src/shared/cache/forecast-cache-policy.js";

const request = {
  location: { latitude: 44.61, longitude: 33.47 },
  days: 2,
} as const;

const forecast: MarineForecast = {
  location: request.location,
  timezone: "UTC",
  generatedAt: "2026-08-27T07:00:00.000Z",
  hourly: [],
};

const freshEnvelope = {
  value: forecast,
  storedAt: "2026-08-27T07:00:00.000Z",
  freshUntil: "2026-08-27T07:30:00.000Z",
};

const now = () => new Date("2026-08-27T07:05:00.000Z");

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
    getForecast: vi.fn<MarineForecastProvider["getForecast"]>(),
  };
  return { cache, cacheGet, cacheSet, provider };
}

describe("CachedMarineForecastProvider", () => {
  it("returns a cache hit without calling Open-Meteo Marine", async () => {
    const { cache, cacheGet, cacheSet, provider } = createDependencies();
    cacheGet.mockResolvedValue(freshEnvelope);
    const cachedProvider = new CachedMarineForecastProvider({
      cache,
      provider,
      now,
    });

    await expect(cachedProvider.getForecast(request)).resolves.toMatchObject(forecast);

    expect(provider.getForecast).not.toHaveBeenCalled();
    expect(cacheSet).not.toHaveBeenCalled();
  });

  it("loads and caches a marine forecast after a cache miss", async () => {
    const { cache, cacheGet, cacheSet, provider } = createDependencies();
    cacheGet.mockResolvedValue(null);
    provider.getForecast.mockResolvedValue(forecast);
    const cachedProvider = new CachedMarineForecastProvider({
      cache,
      provider,
      now,
    });

    await expect(cachedProvider.getForecast(request)).resolves.toMatchObject(forecast);

    expect(provider.getForecast).toHaveBeenCalledWith(request);
    expect(cacheSet).toHaveBeenCalledWith(
      "forecast:marine:44.6100,33.4700:days:2",
      {
        value: forecast,
        storedAt: "2026-08-27T07:05:00.000Z",
        freshUntil: "2026-08-27T07:35:00.000Z",
      },
      forecastCacheRetentionSeconds.marine,
    );
  });

  it("uses the provider when reading Redis fails", async () => {
    const { cache, cacheGet, provider } = createDependencies();
    const onCacheError = vi.fn();
    const cacheError = new Error("Redis unavailable");
    cacheGet.mockRejectedValue(cacheError);
    provider.getForecast.mockResolvedValue(forecast);
    const cachedProvider = new CachedMarineForecastProvider({
      cache,
      provider,
      onCacheError,
    });

    await expect(cachedProvider.getForecast(request)).resolves.toMatchObject(forecast);

    expect(provider.getForecast).toHaveBeenCalledOnce();
    expect(onCacheError).toHaveBeenCalledWith(cacheError);
  });

  it("returns fresh marine data when writing Redis fails", async () => {
    const { cache, cacheGet, cacheSet, provider } = createDependencies();
    const onCacheError = vi.fn();
    cacheGet.mockResolvedValue(null);
    cacheSet.mockRejectedValue(new Error("Redis unavailable"));
    provider.getForecast.mockResolvedValue(forecast);
    const cachedProvider = new CachedMarineForecastProvider({
      cache,
      provider,
      onCacheError,
    });

    await expect(cachedProvider.getForecast(request)).resolves.toMatchObject(forecast);
    expect(onCacheError).toHaveBeenCalledOnce();
  });

  it("returns stale marine data only when Open-Meteo Marine fails", async () => {
    const { cache, cacheGet, provider } = createDependencies();
    cacheGet.mockResolvedValue({
      ...freshEnvelope,
      freshUntil: "2026-08-27T07:04:00.000Z",
    });
    provider.getForecast.mockRejectedValue(
      new Error("Open-Meteo Marine unavailable"),
    );
    const cachedProvider = new CachedMarineForecastProvider({
      cache,
      provider,
      now,
    });

    await expect(cachedProvider.getForecast(request)).resolves.toMatchObject(forecast);
    expect(provider.getForecast).toHaveBeenCalledOnce();
  });

  it("keeps the upstream error when no stale marine data exists", async () => {
    const { cache, cacheGet, provider } = createDependencies();
    cacheGet.mockResolvedValue(null);
    provider.getForecast.mockRejectedValue(
      new Error("Open-Meteo Marine unavailable"),
    );

    await expect(
      new CachedMarineForecastProvider({ cache, provider }).getForecast(request),
    ).rejects.toThrow("Open-Meteo Marine unavailable");
  });
});
