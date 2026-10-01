import { createClient } from "redis";

export interface RedisCacheClient {
  readonly isOpen: boolean;
  readonly isReady: boolean;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  get(key: string): Promise<string | null>;
  setWithTtl(key: string, value: string, ttlSeconds: number): Promise<void>;
  delete(key: string): Promise<void>;
  sendCommand(...args: string[]): Promise<RedisCommandReply>;
}

export type RedisCommandReply =
  | boolean
  | number
  | string
  | Array<boolean | number | string>;

type RedisErrorHandler = (error: Error) => void;

export function createRedisCacheClient(
  url: string,
  onError: RedisErrorHandler,
): RedisCacheClient {
  const client = createClient({
    url,
    disableOfflineQueue: true,
    socket: {
      connectTimeout: 2_000,
      reconnectStrategy: (retries) =>
        Math.min(250 * 2 ** Math.min(retries, 5), 5_000) + Math.floor(Math.random() * 250),
    },
  });
  client.on("error", onError);

  return {
    get isOpen() {
      return client.isOpen;
    },
    get isReady() {
      return client.isReady;
    },
    async connect() {
      await client.connect();
    },
    async disconnect() {
      // Also stop retries when shutting down while Redis is unavailable.
      if (client.isOpen) client.destroy();
    },
    async get(key) {
      return client.get(key);
    },
    async setWithTtl(key, value, ttlSeconds) {
      await client.set(key, value, { EX: ttlSeconds });
    },
    async delete(key) {
      await client.del(key);
    },
    sendCommand(...args) {
      return client.sendCommand<RedisCommandReply>(args);
    },
  };
}
