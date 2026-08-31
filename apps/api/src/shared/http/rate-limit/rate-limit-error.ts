import type { ApiError } from "@kuda-krym/contracts";

export const rateLimitError: ApiError = {
  error: {
    code: "RATE_LIMIT_EXCEEDED",
    message: "Слишком много запросов. Попробуйте снова немного позже.",
  },
};
