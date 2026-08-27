import { describe, expect, it, vi } from "vitest";

import { CachedModelWeatherForecastProvider } from "../../src/modules/weather/models/cache/cached-model-weather-forecast.provider.js";
import type {
  ModelWeatherForecast,
  ModelWeatherForecastProvider,
} from "../../src/modules/weather/models/model-weather-forecast.js";
import type { CacheStore } from "../../src/shared/cache/cache-store.js";
import { forecastCacheRetentionSeconds } from "../../src/shared/cache/forecast-cache-policy.js";

const request = {
  model: "ECMWF_IFS",
  location: { latitude: 44.495, longitude: 34.166 },
  days: 2,
} as const;

const forecast: ModelWeatherForecast = {
  model: request.model,
  location: request.location,
  timezone: "UTC",
  generatedAt: "2026-08-27T08:00:00.000Z",
  hourly: [],
};

const freshEnvelope = {
  value: forecast,
  storedAt: "2026-08-27T08:00:00.000Z",
  freshUntil: "2026-08-27T08:15:00.000Z",
};

const now = () => new Date("2026-08-27T08:05:00.000Z");

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
    getForecast: vi.fn<ModelWeatherForecastProvider["getForecast"]>(),
  };
  return { cache, cacheGet, cacheSet, provider };
}

describe("CachedModelWeatherForecastProvider", () => {
  it("returns a model forecast from cache", async () => {
    const { cache, cacheGet, cacheSet, provider } = createDependencies();
    cacheGet.mockResolvedValue(freshEnvelope);
    const cachedProvider = new CachedModelWeatherForecastProvider({
      cache,
      provider,
      now,
    });

    await expect(cachedProvider.getForecast(request)).resolves.toBe(forecast);
    expect(provider.getForecast).not.toHaveBeenCalled();
    expect(cacheSet).not.toHaveBeenCalled();
  });

  it("loads and caches one specific weather model after a miss", async () => {
    const { cache, cacheGet, cacheSet, provider } = createDependencies();
    cacheGet.mockResolvedValue(null);
    provider.getForecast.mockResolvedValue(forecast);
    const cachedProvider = new CachedModelWeatherForecastProvider({
      cache,
      provider,
      now,
    });

    await expect(cachedProvider.getForecast(request)).resolves.toBe(forecast);

    expect(provider.getForecast).toHaveBeenCalledWith(request);
    expect(cacheSet).toHaveBeenCalledWith(
      "forecast:weather-models:ECMWF_IFS:44.4950,34.1660:days:2",
      {
        value: forecast,
        storedAt: "2026-08-27T08:05:00.000Z",
        freshUntil: "2026-08-27T08:20:00.000Z",
      },
      forecastCacheRetentionSeconds["weather-models"],
    );
  });

  it("falls back to the model provider when Redis read fails", async () => {
    const { cache, cacheGet, provider } = createDependencies();
    const onCacheError = vi.fn();
    const cacheError = new Error("Redis unavailable");
    cacheGet.mockRejectedValue(cacheError);
    provider.getForecast.mockResolvedValue(forecast);
    const cachedProvider = new CachedModelWeatherForecastProvider({
      cache,
      provider,
      onCacheError,
    });

    await expect(cachedProvider.getForecast(request)).resolves.toBe(forecast);
    expect(onCacheError).toHaveBeenCalledWith(cacheError);
  });

  it("returns fresh model data when Redis write fails", async () => {
    const { cache, cacheGet, cacheSet, provider } = createDependencies();
    const onCacheError = vi.fn();
    cacheGet.mockResolvedValue(null);
    cacheSet.mockRejectedValue(new Error("Redis unavailable"));
    provider.getForecast.mockResolvedValue(forecast);
    const cachedProvider = new CachedModelWeatherForecastProvider({
      cache,
      provider,
      onCacheError,
    });

    await expect(cachedProvider.getForecast(request)).resolves.toBe(forecast);
    expect(onCacheError).toHaveBeenCalledOnce();
  });

  it("returns a stale model only when its upstream request fails", async () => {
    const { cache, cacheGet, provider } = createDependencies();
    cacheGet.mockResolvedValue({
      ...freshEnvelope,
      freshUntil: "2026-08-27T08:04:00.000Z",
    });
    provider.getForecast.mockRejectedValue(new Error("ECMWF unavailable"));
    const cachedProvider = new CachedModelWeatherForecastProvider({
      cache,
      provider,
      now,
    });

    await expect(cachedProvider.getForecast(request)).resolves.toBe(forecast);
    expect(provider.getForecast).toHaveBeenCalledOnce();
  });

  it("keeps a model failure when no stale copy exists", async () => {
    const { cache, cacheGet, provider } = createDependencies();
    cacheGet.mockResolvedValue(null);
    provider.getForecast.mockRejectedValue(new Error("ECMWF unavailable"));

    await expect(
      new CachedModelWeatherForecastProvider({
        cache,
        provider,
      }).getForecast(request),
    ).rejects.toThrow("ECMWF unavailable");
  });
});
