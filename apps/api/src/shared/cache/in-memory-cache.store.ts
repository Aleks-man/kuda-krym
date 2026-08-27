import type { CacheStore } from "./cache-store.js";

type CacheEntry = Readonly<{
  expiresAt: number;
  value: unknown;
}>;

type Clock = () => number;

export class InMemoryCacheStore implements CacheStore {
  private readonly entries = new Map<string, CacheEntry>();

  constructor(private readonly now: Clock = Date.now) {}

  async get<T>(key: string): Promise<T | null> {
    const entry = this.entries.get(key);
    if (!entry) return null;

    if (entry.expiresAt <= this.now()) {
      this.entries.delete(key);
      return null;
    }

    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    if (!Number.isFinite(ttlSeconds) || ttlSeconds <= 0) {
      throw new RangeError("Cache TTL must be a positive number of seconds");
    }

    this.entries.set(key, {
      expiresAt: this.now() + ttlSeconds * 1_000,
      value,
    });
  }

  async delete(key: string): Promise<void> {
    this.entries.delete(key);
  }
}
