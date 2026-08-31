import { describe, expect, it, vi } from "vitest";

import type { RedisCacheClient } from "../../../src/shared/cache/redis-cache.client.js";
import { RedisCacheStore } from "../../../src/shared/cache/redis-cache.store.js";

function createClientMock(initiallyOpen = false) {
  let isOpen = initiallyOpen;
  const connect = vi.fn(async () => {
    isOpen = true;
  });
  const disconnect = vi.fn(async () => {
    isOpen = false;
  });
  const get = vi.fn<RedisCacheClient["get"]>();
  const setWithTtl = vi.fn<RedisCacheClient["setWithTtl"]>();
  const deleteValue = vi.fn<RedisCacheClient["delete"]>();
  const sendCommand = vi.fn<RedisCacheClient["sendCommand"]>();

  const client: RedisCacheClient = {
    get isOpen() {
      return isOpen;
    },
    connect,
    disconnect,
    get,
    setWithTtl,
    delete: deleteValue,
    sendCommand,
  };

  return { client, connect, deleteValue, disconnect, get, setWithTtl };
}

describe("RedisCacheStore", () => {
  it("connects and disconnects the client once", async () => {
    const { client, connect, disconnect } = createClientMock();
    const cache = new RedisCacheStore(client);

    await cache.connect();
    await cache.connect();
    await cache.disconnect();
    await cache.disconnect();

    expect(connect).toHaveBeenCalledOnce();
    expect(disconnect).toHaveBeenCalledOnce();
  });

  it("parses a cached JSON value", async () => {
    const { client, get } = createClientMock(true);
    get.mockResolvedValue('{"temperature":24}');
    const cache = new RedisCacheStore(client);

    await expect(cache.get("forecast:test")).resolves.toEqual({ temperature: 24 });
  });

  it("returns null for a cache miss", async () => {
    const { client, get } = createClientMock(true);
    get.mockResolvedValue(null);

    await expect(new RedisCacheStore(client).get("missing")).resolves.toBeNull();
  });

  it("serializes a value and passes its TTL to Redis", async () => {
    const { client, setWithTtl } = createClientMock(true);
    const cache = new RedisCacheStore(client);

    await cache.set("forecast:test", { temperature: 24 }, 900);

    expect(setWithTtl).toHaveBeenCalledWith(
      "forecast:test",
      '{"temperature":24}',
      900,
    );
  });

  it("rejects invalid TTL and non-serializable values", async () => {
    const { client } = createClientMock(true);
    const cache = new RedisCacheStore(client);

    await expect(cache.set("forecast:test", "value", 0)).rejects.toThrow(
      "Cache TTL must be a positive number of seconds",
    );
    await expect(cache.set("forecast:test", undefined, 60)).rejects.toThrow(
      "Cache value must be JSON serializable",
    );
  });

  it("deletes a cached value", async () => {
    const { client, deleteValue } = createClientMock(true);
    const cache = new RedisCacheStore(client);

    await cache.delete("forecast:test");

    expect(deleteValue).toHaveBeenCalledWith("forecast:test");
  });
});
