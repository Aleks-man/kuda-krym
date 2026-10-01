import { waitForSignal } from "./abort.js";

type AsyncTask<T> = (signal: AbortSignal) => Promise<T>;

export interface RequestCoalescer {
  run<T>(key: string, task: AsyncTask<T>, signal?: AbortSignal): Promise<T>;
}

type SharedOperation = {
  controller: AbortController;
  promise: Promise<unknown>;
  subscribers: number;
};

export class InMemoryRequestCoalescer implements RequestCoalescer {
  private readonly inFlight = new Map<string, SharedOperation>();

  async run<T>(key: string, task: AsyncTask<T>, signal?: AbortSignal): Promise<T> {
    signal?.throwIfAborted();
    let operation = this.inFlight.get(key);
    if (!operation) {
      const controller = new AbortController();
      operation = {
        controller,
        subscribers: 0,
        promise: Promise.resolve().then(() => {
          controller.signal.throwIfAborted();
          return task(controller.signal);
        }),
      };
      this.inFlight.set(key, operation);
    }
    operation.subscribers += 1;
    try {
      return await waitForSignal(operation.promise as Promise<T>, signal);
    } finally {
      operation.subscribers -= 1;
      if (operation.subscribers === 0) {
        operation.controller.abort();
        if (this.inFlight.get(key) === operation) this.inFlight.delete(key);
      }
    }
  }
}
