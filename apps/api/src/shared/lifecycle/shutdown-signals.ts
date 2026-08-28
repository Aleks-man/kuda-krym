import type { GracefulShutdown } from "./graceful-shutdown.js";

const shutdownSignals = ["SIGINT", "SIGTERM"] as const;

export function registerShutdownSignals(shutdown: GracefulShutdown): () => void {
  const handlers = shutdownSignals.map((signal) => {
    const handler = () => void shutdown(signal);
    process.once(signal, handler);
    return { signal, handler };
  });

  return () => {
    for (const { signal, handler } of handlers) {
      process.off(signal, handler);
    }
  };
}
