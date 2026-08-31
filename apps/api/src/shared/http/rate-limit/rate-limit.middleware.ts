import { rateLimit, type Store } from "express-rate-limit";

import { rateLimitError } from "./rate-limit-error.js";
import type { RateLimitPolicy } from "./rate-limit.policy.js";

export function createRateLimitMiddleware(
  policy: RateLimitPolicy,
  store?: Store,
) {
  return rateLimit({
    identifier: policy.identifier,
    legacyHeaders: false,
    limit: policy.maxRequests,
    passOnStoreError: true,
    skip: (request) => request.method === "OPTIONS",
    standardHeaders: "draft-8",
    windowMs: policy.windowMs,
    ...(store ? { store } : {}),
    handler: (_request, response) => {
      response.status(429).json(rateLimitError);
    },
  });
}
