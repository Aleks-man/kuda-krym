import { isIP } from "node:net";

export function createApiProxyHeaders(requestHeaders: Headers): Headers {
  const headers = new Headers({ "content-type": "application/json" });
  const clientIp = getClientIp(requestHeaders);

  if (clientIp) headers.set("x-forwarded-for", clientIp);

  return headers;
}

function getClientIp(headers: Headers): string | null {
  // The public proxy must sanitize X-Forwarded-For; web must not be exposed directly.
  // X-Real-IP is client-controlled and must never override that trusted address.
  const address = headers.get("x-forwarded-for")?.split(",", 1)[0]?.trim();
  return address && isIP(address) ? address : null;
}
