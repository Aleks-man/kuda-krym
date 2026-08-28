import type { RequestHandler } from "express";

import type { Logger } from "../logging/logger.js";
import { getRequestId } from "./request-id.js";

type RequestLoggerOptions = Readonly<{
  logger: Logger;
  now?: () => number;
}>;

export function createRequestLogger({
  logger,
  now = () => performance.now(),
}: RequestLoggerOptions): RequestHandler {
  return (request, response, next) => {
    const startedAt = now();

    response.once("finish", () => {
      const context = {
        requestId: getRequestId(response),
        method: request.method,
        path: request.path,
        status: response.statusCode,
        durationMs: Math.max(0, Math.round(now() - startedAt)),
      };

      if (response.statusCode >= 500) {
        logger.error("http.request.completed", context);
      } else if (response.statusCode >= 400) {
        logger.warn("http.request.completed", context);
      } else {
        logger.info("http.request.completed", context);
      }
    });

    next();
  };
}
