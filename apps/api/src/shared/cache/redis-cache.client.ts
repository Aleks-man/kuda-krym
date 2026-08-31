import { createClient } from "redis";

export interface RedisCacheClient {
  readonly isOpen: boolean;
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
    socket: { connectTimeout: 2_000, reconnectStrategy: false },
  });
  client.on("error", onError);

  return {
    get isOpen() {
      return client.isOpen;
    },
    async connect() {
      await client.connect();
    },
    async disconnect() {
      await client.quit();
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
