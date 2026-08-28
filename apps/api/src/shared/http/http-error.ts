export type HttpErrorOptions = Readonly<{
  status: number;
  code: string;
  message: string;
  cause?: unknown;
}>;

export class HttpError extends Error {
  readonly status: number;
  readonly code: string;

  constructor({ status, code, message, cause }: HttpErrorOptions) {
    super(message, cause === undefined ? undefined : { cause });
    this.name = "HttpError";
    this.status = status;
    this.code = code;
  }
}
