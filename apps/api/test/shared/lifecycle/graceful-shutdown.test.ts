import { describe, expect, it, vi } from "vitest";

import { createGracefulShutdown } from "../../../src/shared/lifecycle/graceful-shutdown.js";
import type { Logger } from "../../../src/shared/logging/logger.js";

describe("createGracefulShutdown", () => {
  it("stops HTTP before closing application resources", async () => {
    const calls: string[] = [];
    const shutdown = createGracefulShutdown({
      logger: createLoggerMock(),
      stopServer: async () => {
        calls.push("http");
      },
      resources: [
        { name: "redis", close: async () => void calls.push("redis") },
        { name: "postgresql", close: async () => void calls.push("postgresql") },
      ],
    });

    await shutdown("SIGTERM");

    expect(calls[0]).toBe("http");
    expect(calls.slice(1)).toEqual(expect.arrayContaining(["redis", "postgresql"]));
  });

  it("runs only once when multiple signals arrive", async () => {
    const stopServer = vi.fn().mockResolvedValue(undefined);
    const close = vi.fn().mockResolvedValue(undefined);
    const shutdown = createGracefulShutdown({
      logger: createLoggerMock(),
      stopServer,
      resources: [{ name: "redis", close }],
    });

    await Promise.all([shutdown("SIGINT"), shutdown("SIGTERM")]);

    expect(stopServer).toHaveBeenCalledOnce();
    expect(close).toHaveBeenCalledOnce();
  });

  it("closes remaining resources and reports a failure", async () => {
    const logger = createLoggerMock();
    const onFailure = vi.fn();
    const closePostgresql = vi.fn().mockResolvedValue(undefined);
    const redisError = new Error("Redis close failed");
    const shutdown = createGracefulShutdown({
      logger,
      stopServer: vi.fn().mockRejectedValue(new Error("HTTP close failed")),
      resources: [
        { name: "redis", close: vi.fn().mockRejectedValue(redisError) },
        { name: "postgresql", close: closePostgresql },
      ],
      onFailure,
    });

    await shutdown("SIGTERM");

    expect(closePostgresql).toHaveBeenCalledOnce();
    expect(onFailure).toHaveBeenCalledOnce();
    expect(logger.error).toHaveBeenCalledTimes(2);
    expect(logger.info).toHaveBeenLastCalledWith("app.shutdown.completed", {
      signal: "SIGTERM",
      success: false,
    });
  });
});

function createLoggerMock(): Logger {
  return { info: vi.fn(), warn: vi.fn(), error: vi.fn() };
}
