import { afterEach, describe, expect, it, vi } from "vitest";

import { ConsoleJsonLogger } from "../../../src/shared/logging/console-json.logger.js";

describe("ConsoleJsonLogger", () => {
  afterEach(() => vi.restoreAllMocks());

  it("writes machine-readable JSON and serializes errors", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const logger = new ConsoleJsonLogger();

    logger.error("provider.failed", {
      requestId: "request-id-123",
      error: new Error("Provider unavailable"),
    });

    expect(consoleError).toHaveBeenCalledOnce();
    const entry = JSON.parse(String(consoleError.mock.calls[0]?.[0])) as {
      level: string;
      event: string;
      requestId: string;
      error: { name: string; message: string };
    };
    expect(entry).toMatchObject({
      level: "error",
      event: "provider.failed",
      requestId: "request-id-123",
      error: { name: "Error", message: "Provider unavailable" },
    });
  });
});
