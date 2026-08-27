import type { CacheStore } from "../../../shared/cache/cache-store.js";
import {
  InMemoryRequestCoalescer,
  type RequestCoalescer,
} from "../../../shared/async/request-coalescer.js";
import { createForecastCacheKey } from "../../../shared/cache/forecast-cache-key.js";
import { forecastCacheTtlSeconds } from "../../../shared/cache/forecast-cache-policy.js";
import type {
  MarineForecast,
  MarineForecastProvider,
  MarineForecastRequest,
} from "../marine-forecast.js";

type CacheErrorHandler = (error: unknown) => void;

type CachedMarineForecastProviderOptions = Readonly<{
  cache: CacheStore;
  provider: MarineForecastProvider;
  onCacheError?: CacheErrorHandler;
  coalescer?: RequestCoalescer;
}>;

export class CachedMarineForecastProvider implements MarineForecastProvider {
  private readonly coalescer: RequestCoalescer;

  constructor(private readonly options: CachedMarineForecastProviderOptions) {
    this.coalescer = options.coalescer ?? new InMemoryRequestCoalescer();
  }

  async getForecast(request: MarineForecastRequest): Promise<MarineForecast> {
    const key = createForecastCacheKey("marine", request.location, request.days);
    return this.coalescer.run(key, async () => {
      const cached = await this.readCache(key);
      if (cached) return cached;

      const forecast = await this.options.provider.getForecast(request);
      await this.writeCache(key, forecast);
      return forecast;
    });
  }

  private async readCache(key: string): Promise<MarineForecast | null> {
    try {
      return await this.options.cache.get<MarineForecast>(key);
    } catch (error) {
      this.options.onCacheError?.(error);
      return null;
    }
  }

  private async writeCache(key: string, forecast: MarineForecast): Promise<void> {
    try {
      await this.options.cache.set(
        key,
        forecast,
        forecastCacheTtlSeconds.marine,
      );
    } catch (error) {
      this.options.onCacheError?.(error);
    }
  }
}
