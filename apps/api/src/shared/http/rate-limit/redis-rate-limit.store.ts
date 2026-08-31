import type { Store } from "express-rate-limit";
import { RedisStore, type SendCommandFn } from "rate-limit-redis";

import type { RedisCacheClient } from "../../cache/redis-cache.client.js";

export type RateLimitStores = Readonly<{
  global: Store;
  expensive: Store;
}>;

type RedisCommandClient = Pick<RedisCacheClient, "sendCommand">;

export function createRedisRateLimitStores(
  client: RedisCommandClient,
): RateLimitStores {
  return {
    global: createStore(client, "kuda-krym:rate-limit:api:"),
    expensive: createStore(client, "kuda-krym:rate-limit:expensive:"),
  };
}

function createStore(client: RedisCommandClient, prefix: string): Store {
  const sendCommand: SendCommandFn = (...args) => client.sendCommand(...args);

  return new RedisStore({
    prefix,
    sendCommand,
  });
}
