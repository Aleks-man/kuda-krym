export class ConcurrencyLimiter {
  private active = 0;
  private readonly queue: Array<() => void> = [];

  constructor(private readonly limit: number, private readonly maxQueued = 100) {}

  async run<T>(task: () => Promise<T>, signal?: AbortSignal): Promise<T> {
    signal?.throwIfAborted();
    if (this.active >= this.limit) {
      if (this.queue.length >= this.maxQueued) throw new Error("Upstream queue is full");
      await new Promise<void>((resolve, reject) => {
        const abort = () => {
          const index = this.queue.indexOf(start);
          if (index !== -1) this.queue.splice(index, 1);
          reject(signal?.reason);
        };
        const start = () => {
          signal?.removeEventListener("abort", abort);
          this.active += 1;
          resolve();
        };
        this.queue.push(start);
        signal?.addEventListener("abort", abort, { once: true });
      });
    } else {
      this.active += 1;
    }
    try {
      signal?.throwIfAborted();
      return await task();
    } finally {
      this.active -= 1;
      this.queue.shift()?.();
    }
  }
}
