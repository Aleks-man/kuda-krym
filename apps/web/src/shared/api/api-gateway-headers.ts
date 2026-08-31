const forwardedHeaderNames = [
  "ratelimit",
  "ratelimit-policy",
  "retry-after",
] as const;

type ForwardedHeaderName = (typeof forwardedHeaderNames)[number];

export type ApiGatewayHeaders = Partial<Record<ForwardedHeaderName, string>>;

export function getApiGatewayHeaders(headers: Headers): ApiGatewayHeaders {
  const forwarded: ApiGatewayHeaders = {};

  for (const name of forwardedHeaderNames) {
    const value = headers.get(name);
    if (value) forwarded[name] = value;
  }

  return forwarded;
}
