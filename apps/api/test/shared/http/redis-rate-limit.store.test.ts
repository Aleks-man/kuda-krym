import type { Options } from "express-rate-limit";
import { describe, expect, it, vi } from "vitest";

import { createRedisRateLimitStores } from "../../../src/shared/http/rate-limit/redis-rate-limit.store.js";

describe("Redis rate limit stores", () => {
  it("uses isolated key namespaces for global and expensive budgets", async () => {
    const sendCommand = vi.fn(async () => "script-sha");
    const stores = createRedisRateLimitStores({ sendCommand });
    const options = { windowMs: 60_000 } as Options;

    await stores.global.init?.(options);
    await stores.expensive.init?.(options);

    expect(stores.global.prefix).toBe("kuda-krym:rate-limit:api:");
    expect(stores.expensive.prefix).toBe(
      "kuda-krym:rate-limit:expensive:",
    );
    expect(sendCommand).toHaveBeenCalledWith("SCRIPT", "LOAD", expect.any(String));
  });
});
