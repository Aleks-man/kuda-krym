import type { LogContext, Logger } from "./logger.js";

type LogLevel = "info" | "warn" | "error";

export class ConsoleJsonLogger implements Logger {
  info(event: string, context: LogContext = {}): void {
    this.write("info", event, context);
  }

  warn(event: string, context: LogContext = {}): void {
    this.write("warn", event, context);
  }

  error(event: string, context: LogContext = {}): void {
    this.write("error", event, context);
  }

  private write(level: LogLevel, event: string, context: LogContext): void {
    const entry = JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      event,
      ...normalizeContext(context),
    });

    if (level === "error") {
      console.error(entry);
      return;
    }
    if (level === "warn") {
      console.warn(entry);
      return;
    }
    console.info(entry);
  }
}

function normalizeContext(context: LogContext): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(context).map(([key, value]) => [key, serializeValue(value)]),
  );
}

function serializeValue(value: unknown): unknown {
  if (!(value instanceof Error)) return value;

  return {
    name: value.name,
    message: value.message,
    ...(value.stack ? { stack: value.stack } : {}),
  };
}
