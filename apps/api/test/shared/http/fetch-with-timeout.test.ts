import { describe, expect, it, vi } from "vitest";

import {
  createFetchWithTimeout,
  externalRequestTimeoutMs,
} from "../../../src/shared/http/fetch-with-timeout.js";

describe("createFetchWithTimeout", () => {
  it("adds the shared timeout signal to a request", async () => {
    const signal = new AbortController().signal;
    const createTimeoutSignal = vi.fn(() => signal);
    const fetch = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValue(new Response(null, { status: 204 }));
    const timedFetch = createFetchWithTimeout({
      fetch,
      createTimeoutSignal,
    });

    await timedFetch("https://example.test", {
      headers: { accept: "application/json" },
    });

    expect(createTimeoutSignal).toHaveBeenCalledWith(externalRequestTimeoutMs);
    expect(fetch).toHaveBeenCalledWith("https://example.test", {
      headers: { accept: "application/json" },
      signal,
    });
  });

  it("supports a client-specific timeout", async () => {
    const createTimeoutSignal = vi.fn(() => new AbortController().signal);
    const fetch = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValue(new Response(null, { status: 204 }));
    const timedFetch = createFetchWithTimeout({
      fetch,
      timeoutMs: 2_500,
      createTimeoutSignal,
    });

    await timedFetch("https://example.test");

    expect(createTimeoutSignal).toHaveBeenCalledWith(2_500);
  });

  it("rejects an invalid timeout during configuration", () => {
    expect(() => createFetchWithTimeout({ timeoutMs: 0 })).toThrow(
      "HTTP request timeout must be a positive number",
    );
  });
});
