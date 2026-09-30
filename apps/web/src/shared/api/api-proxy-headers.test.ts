import { describe, expect, it } from "vitest";

import { createApiProxyHeaders } from "./api-proxy-headers";

describe("API proxy headers", () => {
  it("ignores changing spoofed real IPs in favor of the proxy-supplied address", () => {
    for (const spoofedIp of ["198.51.100.10", "198.51.100.99"]) {
      const headers = createApiProxyHeaders(
        new Headers({
          "x-real-ip": spoofedIp,
          "x-forwarded-for": "198.51.100.11, 10.0.0.2",
        }),
      );

      expect(headers.get("content-type")).toBe("application/json");
      expect(headers.get("x-forwarded-for")).toBe("198.51.100.11");
      expect(headers.has("x-real-ip")).toBe(false);
    }
  });

  it("uses the originating forwarded address when real IP is absent", () => {
    const headers = createApiProxyHeaders(
      new Headers({ "x-forwarded-for": "2001:db8::1, 10.0.0.2" }),
    );

    expect(headers.get("x-forwarded-for")).toBe("2001:db8::1");
  });

  it("does not fall back to real IP when the forwarded address is missing or malformed", () => {
    for (const forwarded of [null, "unknown, 198.51.100.10"]) {
      const incoming = new Headers({ "x-real-ip": "198.51.100.99" });
      if (forwarded !== null) incoming.set("x-forwarded-for", forwarded);

      const headers = createApiProxyHeaders(incoming);

      expect(headers.has("x-forwarded-for")).toBe(false);
    }
  });
});
