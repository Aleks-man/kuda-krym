import { MemoryStore, type Options, type Store } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";

import type { RedisCacheClient } from "../../cache/redis-cache.client.js";

export type RateLimitStores = Readonly<{
  global: Store;
  expensive: Store;
}>;

type RedisCommandClient = Pick<RedisCacheClient, "sendCommand" | "isReady">;

export function createRedisRateLimitStores(
  client: RedisCommandClient,
): RateLimitStores {
  return {
    global: createStore(client, "kuda-krym:rate-limit:api:"),
    expensive: createStore(client, "kuda-krym:rate-limit:expensive:"),
  };
}

function createStore(client: RedisCommandClient, prefix: string): Store {
  const local = new MemoryStore();
  const redis = new RedisStore({
    prefix,
    sendCommand: (...args) => client.sendCommand(...args),
  });
  let options: Options;
  let initialized: Promise<void> | undefined;

  async function withRedis<T>(operation: () => Promise<T>): Promise<T | undefined> {
    if (!client.isReady) return undefined;
    try {
      // Lazy initialization also handles Redis being unavailable at API startup.
      initialized ??= redis.init(options);
      await initialized;
      return await operation();
    } catch {
      // Retry script initialization on the next request after recovery.
      initialized = undefined;
      return undefined;
    }
  }

  return {
    prefix,
    init(configuration) {
      options = configuration;
      local.init(configuration);
    },
    async increment(key) {
      // Keep the local budget warm so an outage/reconnection cannot reset it.
      const fallback = await local.increment(key);
      const shared = await withRedis(() => redis.increment(key));
      return shared && shared.totalHits >= fallback.totalHits ? shared : fallback;
    },
    async decrement(key) {
      await local.decrement(key);
      await withRedis(() => redis.decrement(key));
    },
    async resetKey(key) {
      await local.resetKey(key);
      await withRedis(() => redis.resetKey(key));
    },
    shutdown() {
      local.shutdown();
    },
  };
}
