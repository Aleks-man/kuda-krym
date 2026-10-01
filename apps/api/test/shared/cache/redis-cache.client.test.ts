import { createServer, type Socket } from "node:net";
import { once } from "node:events";
import { expect, it, vi } from "vitest";

import { createRedisCacheClient } from "../../../src/shared/cache/redis-cache.client.js";
import { RedisCacheStore } from "../../../src/shared/cache/redis-cache.store.js";

it("recovers cache access after initial refusal and socket loss, and stops retries on shutdown", async () => {
  // A tiny RESP endpoint exercises the real node-redis socket/retry implementation.
  const sockets = new Set<Socket>();
  const values = new Map<string, string>();
  const server = createServer(socket => {
    sockets.add(socket);
    socket.on("close", () => sockets.delete(socket));
    socket.on("error", () => {});
    let input = "";
    socket.on("data", data => {
      input += data.toString();
      for (;;) {
        const parsed = readCommand(input);
        if (!parsed) break;
        input = input.slice(parsed.length);
        const [command, key, value] = parsed.args;
        if (command === "GET") {
          const stored = values.get(key!);
          socket.write(stored === undefined ? "$-1\r\n" : `$${Buffer.byteLength(stored)}\r\n${stored}\r\n`);
        } else {
          if (command === "SET") values.set(key!, value!);
          socket.write("+OK\r\n");
        }
      }
    });
  });
  const start = async (port: number) => {
    server.listen(port, "127.0.0.1");
    await once(server, "listening");
  };
  const stop = async () => {
    const closed = once(server, "close");
    server.close();
    for (const socket of sockets) socket.destroy();
    await closed;
  };
  await start(0);
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Missing TCP address");
  const port = address.port;
  await stop();

  const onError = vi.fn();
  const client = createRedisCacheClient(`redis://127.0.0.1:${port}`, onError);
  const cache = new RedisCacheStore(client);
  const connecting = cache.connect();
  try {
    await vi.waitFor(() => expect(onError).toHaveBeenCalled());
    await start(port);
    await connecting;
    await cache.set("forecast", { temperature: 24 }, 60);
    await expect(cache.get("forecast")).resolves.toEqual({ temperature: 24 });

    await stop();
    await vi.waitFor(() => expect(client.isReady).toBe(false));
    await expect(cache.get("forecast")).rejects.toThrow();
    await start(port);
    await vi.waitFor(() => expect(client.isReady).toBe(true), { timeout: 3_000 });
    await cache.set("forecast", { temperature: 25 }, 60);
    await expect(cache.get("forecast")).resolves.toEqual({ temperature: 25 });

    await stop();
    await vi.waitFor(() => expect(client.isReady).toBe(false));
    await cache.disconnect();
    expect(client.isOpen).toBe(false);
  } finally {
    await cache.disconnect();
    await connecting.catch(() => {});
    if (server.listening) await stop();
  }
}, 10_000);

function readCommand(input: string): { args: string[]; length: number } | null {
  const end = input.indexOf("\r\n");
  if (end < 0) return null;
  const count = Number(input.slice(1, end));
  const args: string[] = [];
  let offset = end + 2;
  for (let index = 0; index < count; index++) {
    const lengthEnd = input.indexOf("\r\n", offset);
    if (lengthEnd < 0) return null;
    const length = Number(input.slice(offset + 1, lengthEnd));
    offset = lengthEnd + 2;
    if (input.length < offset + length + 2) return null;
    args.push(input.slice(offset, offset + length));
    offset += length + 2;
  }
  return { args, length: offset };
}
