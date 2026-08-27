import { describe, expect, it, vi } from "vitest";

import type { CacheStore } from "../../src/shared/cache/cache-store.js";
import {
  forecastCacheRetentionSeconds,
} from "../../src/shared/cache/forecast-cache-policy.js";
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

const freshEnvelope = {
  value: forecast,
  storedAt: "2026-08-27T06:00:00.000Z",
  freshUntil: "2026-08-27T06:15:00.000Z",
};

const now = () => new Date("2026-08-27T06:05:00.000Z");

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
    cacheGet.mockResolvedValue(freshEnvelope);
    const cachedProvider = new CachedWeatherForecastProvider({
      cache,
      provider,
      now,
    });

    await expect(cachedProvider.getForecast(request)).resolves.toBe(forecast);

    expect(provider.getForecast).not.toHaveBeenCalled();
    expect(cacheSet).not.toHaveBeenCalled();
  });

  it("loads and caches a forecast after a cache miss", async () => {
    const { cache, cacheGet, cacheSet, provider } = createDependencies();
    cacheGet.mockResolvedValue(null);
    provider.getForecast.mockResolvedValue(forecast);
    const cachedProvider = new CachedWeatherForecastProvider({
      cache,
      provider,
      now,
    });

    await expect(cachedProvider.getForecast(request)).resolves.toBe(forecast);

    expect(provider.getForecast).toHaveBeenCalledWith(request);
    expect(cacheSet).toHaveBeenCalledWith(
      "forecast:weather:44.6500,33.5300:days:2",
      {
        value: forecast,
        storedAt: "2026-08-27T06:05:00.000Z",
        freshUntil: "2026-08-27T06:20:00.000Z",
      },
      forecastCacheRetentionSeconds.weather,
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

  it("returns stale data only when Open-Meteo fails", async () => {
    const { cache, cacheGet, provider } = createDependencies();
    cacheGet.mockResolvedValue({
      ...freshEnvelope,
      freshUntil: "2026-08-27T06:04:00.000Z",
    });
    provider.getForecast.mockRejectedValue(new Error("Open-Meteo unavailable"));
    const cachedProvider = new CachedWeatherForecastProvider({
      cache,
      provider,
      now,
    });

    await expect(cachedProvider.getForecast(request)).resolves.toBe(forecast);
    expect(provider.getForecast).toHaveBeenCalledOnce();
  });

  it("keeps the upstream error when no stale data exists", async () => {
    const { cache, cacheGet, provider } = createDependencies();
    cacheGet.mockResolvedValue(null);
    provider.getForecast.mockRejectedValue(new Error("Open-Meteo unavailable"));
    const cachedProvider = new CachedWeatherForecastProvider({ cache, provider });

    await expect(cachedProvider.getForecast(request)).rejects.toThrow(
      "Open-Meteo unavailable",
    );
  });

  it("coalesces simultaneous cache misses into one upstream request", async () => {
    const { cache, cacheGet, provider } = createDependencies();
    let resolveForecast!: (value: WeatherForecast) => void;
    const upstreamForecast = new Promise<WeatherForecast>((resolve) => {
      resolveForecast = resolve;
    });
    cacheGet.mockResolvedValue(null);
    provider.getForecast.mockReturnValue(upstreamForecast);
    const cachedProvider = new CachedWeatherForecastProvider({ cache, provider });

    const first = cachedProvider.getForecast(request);
    const second = cachedProvider.getForecast(request);
    resolveForecast(forecast);

    await expect(Promise.all([first, second])).resolves.toEqual([
      forecast,
      forecast,
    ]);
    expect(provider.getForecast).toHaveBeenCalledOnce();
    expect(cacheGet).toHaveBeenCalledOnce();
  });
});
