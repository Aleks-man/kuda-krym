import type { Logger } from "../logging/logger.js";

export type ShutdownResource = Readonly<{
  name: string;
  close: () => Promise<void>;
}>;

type GracefulShutdownOptions = Readonly<{
  logger: Logger;
  stopServer: () => Promise<void>;
  resources: readonly ShutdownResource[];
  onFailure?: () => void;
}>;

export type GracefulShutdown = (signal: NodeJS.Signals) => Promise<void>;

export function createGracefulShutdown({
  logger,
  stopServer,
  resources,
  onFailure = () => undefined,
}: GracefulShutdownOptions): GracefulShutdown {
  let shutdownPromise: Promise<void> | undefined;

  return (signal) => {
    shutdownPromise ??= shutdown(signal);
    return shutdownPromise;
  };

  async function shutdown(signal: NodeJS.Signals): Promise<void> {
    logger.info("app.shutdown.started", { signal });

    const serverResult = await settle("http-server", stopServer);
    const resourceResults = await Promise.all(
      resources.map(({ name, close }) => settle(name, close)),
    );
    const failures = [serverResult, ...resourceResults].filter(
      (result): result is ShutdownFailure => !result.success,
    );

    if (failures.length > 0) {
      onFailure();
      for (const failure of failures) {
        logger.error("app.shutdown.resource_failed", failure);
      }
    }

    logger.info("app.shutdown.completed", {
      signal,
      success: failures.length === 0,
    });
  }
}

type ShutdownResult =
  | Readonly<{ success: true; resource: string }>
  | ShutdownFailure;

type ShutdownFailure = Readonly<{
  success: false;
  resource: string;
  error: unknown;
}>;

async function settle(
  resource: string,
  close: () => Promise<void>,
): Promise<ShutdownResult> {
  try {
    await close();
    return { success: true, resource };
  } catch (error) {
    return { success: false, resource, error };
  }
}
