import type { ApiError } from "@kuda-krym/contracts";
import type { ErrorRequestHandler, Request, Response } from "express";

import { HttpError } from "./http-error.js";

type UnexpectedErrorHandler = (
  error: unknown,
  request: Request,
  response: Response,
) => void;

export type ErrorHandlerOptions = Readonly<{
  onUnexpectedError?: UnexpectedErrorHandler;
}>;

const internalError: ApiError = {
  error: {
    code: "INTERNAL_SERVER_ERROR",
    message: "Внутренняя ошибка сервера",
  },
};

export function createErrorHandler(
  options: ErrorHandlerOptions = {},
): ErrorRequestHandler {
  const onUnexpectedError = options.onUnexpectedError ?? console.error;

  return (error, request, response, next) => {
    if (response.headersSent) {
      next(error);
      return;
    }

    if (error instanceof HttpError) {
      if (error.status >= 500) {
        onUnexpectedError(error.cause ?? error, request, response);
      }

      const body: ApiError = {
        error: { code: error.code, message: error.message },
      };
      response.status(error.status).json(body);
      return;
    }

    onUnexpectedError(error, request, response);
    response.status(500).json(internalError);
  };
}
