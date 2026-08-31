import { isIP } from "node:net";

export function createApiProxyHeaders(requestHeaders: Headers): Headers {
  const headers = new Headers({ "content-type": "application/json" });
  const clientIp = getClientIp(requestHeaders);

  if (clientIp) headers.set("x-forwarded-for", clientIp);

  return headers;
}

function getClientIp(headers: Headers): string | null {
  const candidates = [
    headers.get("x-real-ip"),
    headers.get("x-forwarded-for")?.split(",", 1)[0],
  ];

  for (const candidate of candidates) {
    const normalized = candidate?.trim();
    if (normalized && isIP(normalized)) return normalized;
  }

  return null;
}
