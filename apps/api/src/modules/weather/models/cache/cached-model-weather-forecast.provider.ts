import type { CacheStore } from "../../../../shared/cache/cache-store.js";
import {
  createCacheEnvelope,
  getCacheFreshness,
  parseCacheEnvelope,
  type CacheEnvelope,
} from "../../../../shared/cache/cache-envelope.js";
import {
  InMemoryRequestCoalescer,
  type RequestCoalescer,
} from "../../../../shared/async/request-coalescer.js";
import { createWeatherModelCacheKey } from "../../../../shared/cache/forecast-cache-key.js";
import {
  forecastCacheRetentionSeconds,
  forecastCacheTtlSeconds,
} from "../../../../shared/cache/forecast-cache-policy.js";
import type {
  ModelWeatherForecast,
  ModelWeatherForecastProvider,
  ModelWeatherForecastRequest,
} from "../model-weather-forecast.js";

type CacheErrorHandler = (error: unknown) => void;

type CachedModelWeatherForecastProviderOptions = Readonly<{
  cache: CacheStore;
  provider: ModelWeatherForecastProvider;
  onCacheError?: CacheErrorHandler;
  coalescer?: RequestCoalescer;
  now?: () => Date;
}>;

export class CachedModelWeatherForecastProvider
  implements ModelWeatherForecastProvider
{
  private readonly coalescer: RequestCoalescer;

  constructor(
    private readonly options: CachedModelWeatherForecastProviderOptions,
  ) {
    this.coalescer = options.coalescer ?? new InMemoryRequestCoalescer();
  }

  async getForecast(
    request: ModelWeatherForecastRequest,
  ): Promise<ModelWeatherForecast> {
    const key = createWeatherModelCacheKey(
      request.model,
      request.location,
      request.days,
    );
    return this.coalescer.run(key, async () => {
      const cached = await this.readCache(key);
      if (cached && getCacheFreshness(cached, this.currentTime()) === "FRESH") {
        return cached.value;
      }

      try {
        const forecast = await this.options.provider.getForecast(request);
        await this.writeCache(key, forecast);
        return forecast;
      } catch (error) {
        if (cached) return cached.value;
        throw error;
      }
    });
  }

  private async readCache(
    key: string,
  ): Promise<CacheEnvelope<ModelWeatherForecast> | null> {
    try {
      const cached = await this.options.cache.get<unknown>(key);
      return cached === null
        ? null
        : parseCacheEnvelope<ModelWeatherForecast>(cached);
    } catch (error) {
      this.options.onCacheError?.(error);
      return null;
    }
  }

  private async writeCache(
    key: string,
    forecast: ModelWeatherForecast,
  ): Promise<void> {
    try {
      await this.options.cache.set(
        key,
        createCacheEnvelope(
          forecast,
          forecastCacheTtlSeconds["weather-models"],
          this.options.now,
        ),
        forecastCacheRetentionSeconds["weather-models"],
      );
    } catch (error) {
      this.options.onCacheError?.(error);
    }
  }

  private currentTime(): Date {
    return this.options.now?.() ?? new Date();
  }
}
