import { rateLimit } from "express-rate-limit";

import { rateLimitError } from "./rate-limit-error.js";
import type { RateLimitPolicy } from "./rate-limit.policy.js";

export function createRateLimitMiddleware(policy: RateLimitPolicy) {
  return rateLimit({
    identifier: policy.identifier,
    legacyHeaders: false,
    limit: policy.maxRequests,
    standardHeaders: "draft-8",
    windowMs: policy.windowMs,
    handler: (_request, response) => {
      response.status(429).json(rateLimitError);
    },
  });
}
