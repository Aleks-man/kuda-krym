import type { CacheStore } from "./cache-store.js";
import type { RedisCacheClient } from "./redis-cache.client.js";

export class RedisCacheStore implements CacheStore {
  constructor(private readonly client: RedisCacheClient) {}

  async connect(): Promise<void> {
    if (!this.client.isOpen) await this.client.connect();
  }

  async disconnect(): Promise<void> {
    if (this.client.isOpen) await this.client.disconnect();
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    return value === null ? null : (JSON.parse(value) as T);
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    if (!Number.isFinite(ttlSeconds) || ttlSeconds <= 0) {
      throw new RangeError("Cache TTL must be a positive number of seconds");
    }

    const serialized = JSON.stringify(value);
    if (serialized === undefined) {
      throw new TypeError("Cache value must be JSON serializable");
    }

    await this.client.setWithTtl(key, serialized, ttlSeconds);
  }

  async delete(key: string): Promise<void> {
    await this.client.delete(key);
  }
}
