import type { CacheStore } from "../../../../shared/cache/cache-store.js";
import {
  InMemoryRequestCoalescer,
  type RequestCoalescer,
} from "../../../../shared/async/request-coalescer.js";
import { createWeatherModelCacheKey } from "../../../../shared/cache/forecast-cache-key.js";
import { forecastCacheTtlSeconds } from "../../../../shared/cache/forecast-cache-policy.js";
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
      if (cached) return cached;

      const forecast = await this.options.provider.getForecast(request);
      await this.writeCache(key, forecast);
      return forecast;
    });
  }

  private async readCache(key: string): Promise<ModelWeatherForecast | null> {
    try {
      return await this.options.cache.get<ModelWeatherForecast>(key);
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
        forecast,
        forecastCacheTtlSeconds["weather-models"],
      );
    } catch (error) {
      this.options.onCacheError?.(error);
    }
  }
}
