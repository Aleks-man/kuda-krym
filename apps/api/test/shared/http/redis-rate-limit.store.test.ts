import express from "express";
import request from "supertest";
import type { Options } from "express-rate-limit";
import { describe, expect, it, vi } from "vitest";

import { createRedisRateLimitStores } from "../../../src/shared/http/rate-limit/redis-rate-limit.store.js";
import { createRateLimitMiddleware } from "../../../src/shared/http/rate-limit/rate-limit.middleware.js";

describe("Redis rate limit stores", () => {
  it("uses isolated key namespaces for global and expensive budgets", async () => {
    const sendCommand = vi.fn(async (...args: string[]) =>
      args[0] === "SCRIPT" ? "script-sha" : [1, 60_000],
    );
    const stores = createRedisRateLimitStores({ sendCommand, isReady: true });
    const options = { windowMs: 60_000 } as Options;

    try {
      await stores.global.init?.(options);
      await stores.expensive.init?.(options);
      await stores.global.increment("client");
      await stores.expensive.increment("client");

      expect(stores.global.prefix).toBe("kuda-krym:rate-limit:api:");
      expect(stores.expensive.prefix).toBe("kuda-krym:rate-limit:expensive:");
      expect(sendCommand).toHaveBeenCalledWith(
        "EVALSHA", "script-sha", "1", "kuda-krym:rate-limit:api:client", "60000",
      );
      expect(sendCommand).toHaveBeenCalledWith(
        "EVALSHA", "script-sha", "1", "kuda-krym:rate-limit:expensive:client", "60000",
      );
    } finally {
      await stores.global.shutdown?.();
      await stores.expensive.shutdown?.();
    }
  });

  it("enforces a local budget through startup outage, failed initialization and recovery", async () => {
    let isReady = false;
    let failed = false;
    let sharedHits = 0;
    const sendCommand = vi.fn(async (...args: string[]) => {
      if (failed) throw new Error("Redis connection lost");
      return args[0] === "SCRIPT" ? "script-sha" : [++sharedHits, 60_000];
    });
    const stores = createRedisRateLimitStores({
      get isReady() { return isReady; },
      sendCommand,
    });
    const app = express();
    app.use(createRateLimitMiddleware(
      { identifier: "recovery", maxRequests: 3, windowMs: 60_000 },
      stores.global,
    ));
    app.get("/", (_req, res) => { res.sendStatus(200); });

    try {
      await request(app).get("/").expect(200);
      expect(sendCommand).not.toHaveBeenCalled();

      // A disconnect can race with isReady, including during SCRIPT LOAD.
      isReady = true;
      failed = true;
      await request(app).get("/").expect(200);
      failed = false;
      await request(app).get("/").expect(200);
      expect(sharedHits).toBe(1);
      await request(app).get("/").expect(429);

      // Runtime failure also keeps the existing local budget.
      failed = true;
      await request(app).get("/").expect(429);
      failed = false;
      sharedHits = 20;
      const result = await stores.global.increment("other-client");
      expect(result.totalHits).toBe(21);
    } finally {
      await stores.global.shutdown?.();
      await stores.expensive.shutdown?.();
    }
  });
});
