import type { DepartureLocation } from "@kuda-krym/contracts";

import {
  InMemoryRequestCoalescer,
  type RequestCoalescer,
} from "../../../shared/async/request-coalescer.js";
import type { CacheStore } from "../../../shared/cache/cache-store.js";
import type { DepartureLocationProvider } from "../departure-location.provider.js";
import { createDepartureLocationCacheKey } from "./departure-location-cache-key.js";
import { departureLocationCacheTtlSeconds } from "./departure-location-cache.policy.js";

type CacheErrorHandler = (error: unknown) => void;

type CachedDepartureLocationProviderOptions = Readonly<{
  cache: CacheStore;
  provider: DepartureLocationProvider;
  coalescer?: RequestCoalescer;
  onCacheError?: CacheErrorHandler;
}>;

export class CachedDepartureLocationProvider
  implements DepartureLocationProvider
{
  private readonly coalescer: RequestCoalescer;

  public constructor(
    private readonly options: CachedDepartureLocationProviderOptions,
  ) {
    this.coalescer = options.coalescer ?? new InMemoryRequestCoalescer();
  }

  public async search(query: string): Promise<readonly DepartureLocation[]> {
    const key = createDepartureLocationCacheKey(query);

    return this.coalescer.run(key, async () => {
      const cached = await this.readCache(key);
      if (cached) return cached;

      const locations = await this.options.provider.search(query.trim());
      await this.writeCache(key, locations);
      return locations;
    });
  }

  private async readCache(key: string): Promise<DepartureLocation[] | null> {
    try {
      return await this.options.cache.get<DepartureLocation[]>(key);
    } catch (error) {
      this.options.onCacheError?.(error);
      return null;
    }
  }

  private async writeCache(
    key: string,
    locations: readonly DepartureLocation[],
  ): Promise<void> {
    try {
      await this.options.cache.set(
        key,
        locations,
        departureLocationCacheTtlSeconds,
      );
    } catch (error) {
      this.options.onCacheError?.(error);
    }
  }
}
