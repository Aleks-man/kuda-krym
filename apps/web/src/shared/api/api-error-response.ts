import { apiErrorSchema } from "@kuda-krym/contracts";
import { NextResponse } from "next/server";

import type { ApiGatewayError } from "./api-gateway-error";
import type { ApiGatewayHeaders } from "./api-gateway-headers";

type ApiErrorResponseOptions = Readonly<{
  code: string;
  message: string;
  status: number;
  headers?: ApiGatewayHeaders;
}>;

export function createApiErrorResponse({
  code,
  message,
  status,
  headers,
}: ApiErrorResponseOptions) {
  return NextResponse.json(
    apiErrorSchema.parse({ error: { code, message } }),
    { status, headers },
  );
}

export function createApiGatewayErrorResponse(error: ApiGatewayError) {
  const status = error.status >= 400 && error.status < 500 ? error.status : 502;

  return createApiErrorResponse({
    code: error.code,
    message: error.message,
    status,
    headers: error.headers,
  });
}
