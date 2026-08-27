import type { CacheStore } from "../../../shared/cache/cache-store.js";
import { markDataFreshness } from "../../../shared/cache/cache-freshness.js";
import {
  createCacheEnvelope,
  getCacheFreshness,
  parseCacheEnvelope,
  type CacheEnvelope,
} from "../../../shared/cache/cache-envelope.js";
import {
  InMemoryRequestCoalescer,
  type RequestCoalescer,
} from "../../../shared/async/request-coalescer.js";
import { createForecastCacheKey } from "../../../shared/cache/forecast-cache-key.js";
import {
  forecastCacheRetentionSeconds,
  forecastCacheTtlSeconds,
} from "../../../shared/cache/forecast-cache-policy.js";
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
  now?: () => Date;
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
      if (cached && getCacheFreshness(cached, this.currentTime()) === "FRESH") {
        return markDataFreshness(cached.value, "FRESH");
      }

      try {
        const forecast = await this.options.provider.getForecast(request);
        await this.writeCache(key, forecast);
        return markDataFreshness(forecast, "FRESH");
      } catch (error) {
        if (cached) return markDataFreshness(cached.value, "STALE");
        throw error;
      }
    });
  }

  private async readCache(
    key: string,
  ): Promise<CacheEnvelope<MarineForecast> | null> {
    try {
      const cached = await this.options.cache.get<unknown>(key);
      return cached === null ? null : parseCacheEnvelope<MarineForecast>(cached);
    } catch (error) {
      this.options.onCacheError?.(error);
      return null;
    }
  }

  private async writeCache(key: string, forecast: MarineForecast): Promise<void> {
    try {
      await this.options.cache.set(
        key,
        createCacheEnvelope(
          forecast,
          forecastCacheTtlSeconds.marine,
          this.options.now,
        ),
        forecastCacheRetentionSeconds.marine,
      );
    } catch (error) {
      this.options.onCacheError?.(error);
    }
  }

  private currentTime(): Date {
    return this.options.now?.() ?? new Date();
  }
}
