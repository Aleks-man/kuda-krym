import { describe, expect, it } from "vitest";

import { createApiProxyHeaders } from "./api-proxy-headers";

describe("API proxy headers", () => {
  it("forwards a valid real client address", () => {
    const headers = createApiProxyHeaders(
      new Headers({
        "x-real-ip": "198.51.100.10",
        "x-forwarded-for": "198.51.100.11, 10.0.0.2",
      }),
    );

    expect(headers.get("content-type")).toBe("application/json");
    expect(headers.get("x-forwarded-for")).toBe("198.51.100.10");
  });

  it("uses the originating forwarded address when real IP is absent", () => {
    const headers = createApiProxyHeaders(
      new Headers({ "x-forwarded-for": "2001:db8::1, 10.0.0.2" }),
    );

    expect(headers.get("x-forwarded-for")).toBe("2001:db8::1");
  });

  it("does not forward malformed client addresses", () => {
    const headers = createApiProxyHeaders(
      new Headers({ "x-forwarded-for": "unknown, 198.51.100.10" }),
    );

    expect(headers.has("x-forwarded-for")).toBe(false);
  });
});
