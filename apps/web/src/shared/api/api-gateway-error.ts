import type { ApiGatewayHeaders } from "./api-gateway-headers";

type ApiGatewayErrorOptions = Readonly<{
  message: string;
  status: number;
  code: string;
  headers?: ApiGatewayHeaders;
}>;

export class ApiGatewayError extends Error {
  readonly status: number;
  readonly code: string;
  readonly headers: ApiGatewayHeaders;

  constructor({ message, status, code, headers = {} }: ApiGatewayErrorOptions) {
    super(message);
    this.name = "ApiGatewayError";
    this.status = status;
    this.code = code;
    this.headers = headers;
  }
}
