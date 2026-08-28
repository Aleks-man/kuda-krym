import { randomUUID } from "node:crypto";

import type { RequestHandler, Response } from "express";

export const requestIdHeader = "x-request-id";

type RequestIdOptions = Readonly<{
  createId?: () => string;
}>;

export function createRequestIdMiddleware(
  options: RequestIdOptions = {},
): RequestHandler {
  const createId = options.createId ?? randomUUID;

  return (_request, response, next) => {
    const requestId = createId();
    response.locals.requestId = requestId;
    response.setHeader(requestIdHeader, requestId);
    next();
  };
}

export function getRequestId(response: Response): string | undefined {
  const requestId: unknown = response.locals.requestId;
  return typeof requestId === "string" ? requestId : undefined;
}
