import express from "express";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";

import { createRequestIdMiddleware } from "../../../src/shared/http/request-id.js";
import { createRequestLogger } from "../../../src/shared/http/request-logger.js";
import type { Logger } from "../../../src/shared/logging/logger.js";

describe("HTTP request observability", () => {
  it("returns a request ID and writes a structured completion event", async () => {
    const logger = createLoggerMock();
    const app = express();
    const clock = vi.fn().mockReturnValueOnce(100).mockReturnValueOnce(112.4);
    app.use(
      createRequestIdMiddleware({ createId: () => "request-id-123" }),
    );
    app.use(createRequestLogger({ logger, now: clock }));
    app.get("/health", (_request, response) => response.sendStatus(204));

    const response = await request(app).get("/health?details=true");

    expect(response.headers["x-request-id"]).toBe("request-id-123");
    expect(logger.info).toHaveBeenCalledWith("http.request.completed", {
      requestId: "request-id-123",
      method: "GET",
      path: "/health",
      status: 204,
      durationMs: 12,
    });
  });

  it("uses the warning level for a client error", async () => {
    const logger = createLoggerMock();
    const app = express();
    app.use(createRequestIdMiddleware());
    app.use(createRequestLogger({ logger, now: () => 0 }));
    app.get("/missing", (_request, response) => response.sendStatus(404));

    await request(app).get("/missing");

    expect(logger.warn).toHaveBeenCalledWith(
      "http.request.completed",
      expect.objectContaining({ status: 404 }),
    );
  });
});

function createLoggerMock(): Logger {
  return {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };
}
