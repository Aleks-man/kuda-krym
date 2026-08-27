export type CacheFreshness = "FRESH" | "STALE";

export type CacheEnvelope<T> = Readonly<{
  value: T;
  storedAt: string;
  freshUntil: string;
}>;

type Clock = () => Date;

export function createCacheEnvelope<T>(
  value: T,
  freshForSeconds: number,
  now: Clock = () => new Date(),
): CacheEnvelope<T> {
  if (!Number.isFinite(freshForSeconds) || freshForSeconds <= 0) {
    throw new RangeError("Cache freshness TTL must be a positive number of seconds");
  }

  const storedAt = now();
  assertValidDate(storedAt, "Cache storage time must be a valid date");

  return {
    value,
    storedAt: storedAt.toISOString(),
    freshUntil: new Date(
      storedAt.getTime() + freshForSeconds * 1_000,
    ).toISOString(),
  };
}

export function parseCacheEnvelope<T>(input: unknown): CacheEnvelope<T> {
  if (!isRecord(input) || !("value" in input)) {
    throw new TypeError("Invalid cache envelope");
  }

  const storedAt = parseTimestamp(input.storedAt, "storedAt");
  const freshUntil = parseTimestamp(input.freshUntil, "freshUntil");
  if (freshUntil < storedAt) {
    throw new RangeError("Cache freshUntil cannot be earlier than storedAt");
  }

  return input as CacheEnvelope<T>;
}

export function getCacheFreshness(
  envelope: CacheEnvelope<unknown>,
  now = new Date(),
): CacheFreshness {
  assertValidDate(now, "Cache comparison time must be a valid date");
  const freshUntil = parseTimestamp(envelope.freshUntil, "freshUntil");
  return now.getTime() < freshUntil ? "FRESH" : "STALE";
}

export function getCacheAgeSeconds(
  envelope: CacheEnvelope<unknown>,
  now = new Date(),
): number {
  assertValidDate(now, "Cache comparison time must be a valid date");
  const storedAt = parseTimestamp(envelope.storedAt, "storedAt");
  return Math.max(0, Math.floor((now.getTime() - storedAt) / 1_000));
}

function parseTimestamp(value: unknown, field: string): number {
  if (typeof value !== "string") {
    throw new TypeError(`Cache ${field} must be an ISO date string`);
  }

  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) {
    throw new TypeError(`Cache ${field} must be an ISO date string`);
  }
  return timestamp;
}

function assertValidDate(date: Date, message: string): void {
  if (!Number.isFinite(date.getTime())) throw new TypeError(message);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
