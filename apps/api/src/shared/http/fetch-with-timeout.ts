export const externalRequestTimeoutMs = 8_000;

type TimeoutSignalFactory = (timeoutMs: number) => AbortSignal;

export type FetchWithTimeoutOptions = Readonly<{
  fetch?: typeof globalThis.fetch;
  timeoutMs?: number;
  createTimeoutSignal?: TimeoutSignalFactory;
}>;

export function createFetchWithTimeout(
  options: FetchWithTimeoutOptions = {},
): typeof globalThis.fetch {
  const fetch = options.fetch ?? globalThis.fetch;
  const timeoutMs = options.timeoutMs ?? externalRequestTimeoutMs;
  const createTimeoutSignal =
    options.createTimeoutSignal ?? AbortSignal.timeout.bind(AbortSignal);

  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new RangeError("HTTP request timeout must be a positive number");
  }

  return (input, init) =>
    fetch(input, {
      ...init,
      signal: createTimeoutSignal(timeoutMs),
    });
}
