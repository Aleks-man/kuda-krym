import type { CacheStore } from "../../../shared/cache/cache-store.js";
import {
  InMemoryRequestCoalescer,
  type RequestCoalescer,
} from "../../../shared/async/request-coalescer.js";
import { createForecastCacheKey } from "../../../shared/cache/forecast-cache-key.js";
import { forecastCacheTtlSeconds } from "../../../shared/cache/forecast-cache-policy.js";
import type {
  WeatherForecast,
  WeatherForecastProvider,
  WeatherForecastRequest,
} from "../weather-forecast.js";

type CacheErrorHandler = (error: unknown) => void;

type CachedWeatherForecastProviderOptions = Readonly<{
  cache: CacheStore;
  provider: WeatherForecastProvider;
  onCacheError?: CacheErrorHandler;
  coalescer?: RequestCoalescer;
}>;

export class CachedWeatherForecastProvider implements WeatherForecastProvider {
  private readonly coalescer: RequestCoalescer;

  constructor(private readonly options: CachedWeatherForecastProviderOptions) {
    this.coalescer = options.coalescer ?? new InMemoryRequestCoalescer();
  }

  async getForecast(request: WeatherForecastRequest): Promise<WeatherForecast> {
    const key = createForecastCacheKey("weather", request.location, request.days);
    return this.coalescer.run(key, async () => {
      const cached = await this.readCache(key);
      if (cached) return cached;

      const forecast = await this.options.provider.getForecast(request);
      await this.writeCache(key, forecast);
      return forecast;
    });
  }

  private async readCache(key: string): Promise<WeatherForecast | null> {
    try {
      return await this.options.cache.get<WeatherForecast>(key);
    } catch (error) {
      this.options.onCacheError?.(error);
      return null;
    }
  }

  private async writeCache(key: string, forecast: WeatherForecast): Promise<void> {
    try {
      await this.options.cache.set(
        key,
        forecast,
        forecastCacheTtlSeconds.weather,
      );
    } catch (error) {
      this.options.onCacheError?.(error);
    }
  }
}
