import { describe, expect, it } from "vitest";

import { getApiGatewayHeaders } from "./api-gateway-headers";

describe("API gateway response headers", () => {
  it("keeps only rate limit metadata from the upstream response", () => {
    const headers = new Headers({
      ratelimit: '"expensive-api"; r=0; t=45',
      "ratelimit-policy": '"expensive-api"; q=10; w=60',
      "retry-after": "45",
      "set-cookie": "session=unexpected",
      "x-upstream-debug": "internal",
    });

    expect(getApiGatewayHeaders(headers)).toEqual({
      ratelimit: '"expensive-api"; r=0; t=45',
      "ratelimit-policy": '"expensive-api"; q=10; w=60',
      "retry-after": "45",
    });
  });
});
