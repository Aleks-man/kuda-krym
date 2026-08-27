import type { CacheStore } from "../../../shared/cache/cache-store.js";
import { createRouteCacheKey } from "../../../shared/cache/route-cache-key.js";
import { routeCacheTtlSeconds } from "../../../shared/cache/route-cache-policy.js";
import type { DrivingRoute, RouteRequest, RoutingProvider } from "../route.js";

type CacheErrorHandler = (error: unknown) => void;

type CachedRoutingProviderOptions = Readonly<{
  cache: CacheStore;
  provider: RoutingProvider;
  onCacheError?: CacheErrorHandler;
}>;

export class CachedRoutingProvider implements RoutingProvider {
  constructor(private readonly options: CachedRoutingProviderOptions) {}

  async getDrivingRoute(request: RouteRequest): Promise<DrivingRoute> {
    const key = createRouteCacheKey(request.origin, request.destination);
    const cached = await this.readCache(key);
    if (cached) return { ...cached, cached: true };

    const route = await this.options.provider.getDrivingRoute(request);
    await this.writeCache(key, route);
    return { ...route, cached: false };
  }

  private async readCache(key: string): Promise<DrivingRoute | null> {
    try {
      return await this.options.cache.get<DrivingRoute>(key);
    } catch (error) {
      this.options.onCacheError?.(error);
      return null;
    }
  }

  private async writeCache(key: string, route: DrivingRoute): Promise<void> {
    try {
      await this.options.cache.set(key, route, routeCacheTtlSeconds);
    } catch (error) {
      this.options.onCacheError?.(error);
    }
  }
}
