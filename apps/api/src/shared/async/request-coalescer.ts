type AsyncTask<T> = () => Promise<T>;

export interface RequestCoalescer {
  run<T>(key: string, task: AsyncTask<T>): Promise<T>;
}

export class InMemoryRequestCoalescer implements RequestCoalescer {
  private readonly inFlight = new Map<string, Promise<unknown>>();

  async run<T>(key: string, task: AsyncTask<T>): Promise<T> {
    const existing = this.inFlight.get(key) as Promise<T> | undefined;
    if (existing) return existing;

    const operation = Promise.resolve().then(task);
    this.inFlight.set(key, operation);

    try {
      return await operation;
    } finally {
      if (this.inFlight.get(key) === operation) {
        this.inFlight.delete(key);
      }
    }
  }
}
