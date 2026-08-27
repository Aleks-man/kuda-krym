import { describe, expect, it, vi } from "vitest";

import type { CacheStore } from "../../src/shared/cache/cache-store.js";
import { forecastCacheTtlSeconds } from "../../src/shared/cache/forecast-cache-policy.js";
import { CachedWeatherForecastProvider } from "../../src/modules/weather/cache/cached-weather-forecast.provider.js";
import type {
  WeatherForecast,
  WeatherForecastProvider,
} from "../../src/modules/weather/weather-forecast.js";

const request = {
  location: { latitude: 44.65, longitude: 33.53 },
  days: 2,
} as const;

const forecast: WeatherForecast = {
  location: request.location,
  timezone: "UTC",
  generatedAt: "2026-08-27T06:00:00.000Z",
  hourly: [],
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
    getForecast: vi.fn<WeatherForecastProvider["getForecast"]>(),
  };
  return { cache, cacheGet, cacheSet, provider };
}

describe("CachedWeatherForecastProvider", () => {
  it("returns a cache hit without calling Open-Meteo", async () => {
    const { cache, cacheGet, cacheSet, provider } = createDependencies();
    cacheGet.mockResolvedValue(forecast);
    const cachedProvider = new CachedWeatherForecastProvider({ cache, provider });

    await expect(cachedProvider.getForecast(request)).resolves.toBe(forecast);

    expect(provider.getForecast).not.toHaveBeenCalled();
    expect(cacheSet).not.toHaveBeenCalled();
  });

  it("loads and caches a forecast after a cache miss", async () => {
    const { cache, cacheGet, cacheSet, provider } = createDependencies();
    cacheGet.mockResolvedValue(null);
    provider.getForecast.mockResolvedValue(forecast);
    const cachedProvider = new CachedWeatherForecastProvider({ cache, provider });

    await expect(cachedProvider.getForecast(request)).resolves.toBe(forecast);

    expect(provider.getForecast).toHaveBeenCalledWith(request);
    expect(cacheSet).toHaveBeenCalledWith(
      "forecast:weather:44.6500,33.5300:days:2",
      forecast,
      forecastCacheTtlSeconds.weather,
    );
  });

  it("falls back to the provider when reading Redis fails", async () => {
    const { cache, cacheGet, provider } = createDependencies();
    const onCacheError = vi.fn();
    const cacheError = new Error("Redis unavailable");
    cacheGet.mockRejectedValue(cacheError);
    provider.getForecast.mockResolvedValue(forecast);
    const cachedProvider = new CachedWeatherForecastProvider({
      cache,
      provider,
      onCacheError,
    });

    await expect(cachedProvider.getForecast(request)).resolves.toBe(forecast);

    expect(provider.getForecast).toHaveBeenCalledOnce();
    expect(onCacheError).toHaveBeenCalledWith(cacheError);
  });

  it("returns the fresh forecast when writing Redis fails", async () => {
    const { cache, cacheGet, cacheSet, provider } = createDependencies();
    const onCacheError = vi.fn();
    cacheGet.mockResolvedValue(null);
    cacheSet.mockRejectedValue(new Error("Redis unavailable"));
    provider.getForecast.mockResolvedValue(forecast);
    const cachedProvider = new CachedWeatherForecastProvider({
      cache,
      provider,
      onCacheError,
    });

    await expect(cachedProvider.getForecast(request)).resolves.toBe(forecast);
    expect(onCacheError).toHaveBeenCalledOnce();
  });
});
