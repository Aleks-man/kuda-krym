import type { CacheStore } from "../../../shared/cache/cache-store.js";
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
}>;

export class CachedWeatherForecastProvider implements WeatherForecastProvider {
  constructor(private readonly options: CachedWeatherForecastProviderOptions) {}

  async getForecast(request: WeatherForecastRequest): Promise<WeatherForecast> {
    const key = createForecastCacheKey("weather", request.location, request.days);
    const cached = await this.readCache(key);
    if (cached) return cached;

    const forecast = await this.options.provider.getForecast(request);
    await this.writeCache(key, forecast);
    return forecast;
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
