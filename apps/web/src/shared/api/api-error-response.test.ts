import { describe, expect, it } from "vitest";

import { ApiGatewayError } from "./api-gateway-error";
import { createApiGatewayErrorResponse } from "./api-error-response";

describe("API gateway error response", () => {
  it("preserves a client error and its rate limit metadata", async () => {
    const response = createApiGatewayErrorResponse(
      new ApiGatewayError({
        code: "RATE_LIMIT_EXCEEDED",
        message: "Слишком много запросов",
        status: 429,
        headers: { ratelimit: '"api"; r=0; t=30', "retry-after": "30" },
      }),
    );

    expect(response.status).toBe(429);
    expect(response.headers.get("ratelimit")).toBe('"api"; r=0; t=30');
    expect(response.headers.get("retry-after")).toBe("30");
    await expect(response.json()).resolves.toEqual({
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: "Слишком много запросов",
      },
    });
  });

  it("maps an upstream server error to a bad gateway response", () => {
    const response = createApiGatewayErrorResponse(
      new ApiGatewayError({
        code: "UPSTREAM_ERROR",
        message: "Upstream failed",
        status: 503,
      }),
    );

    expect(response.status).toBe(502);
  });
});
