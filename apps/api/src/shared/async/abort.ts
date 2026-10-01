export function waitForSignal<T>(operation: Promise<T>, signal?: AbortSignal): Promise<T> {
  if (!signal) return operation;
  return new Promise<T>((resolve, reject) => {
    const abort = () => reject(signal.reason);
    signal.addEventListener("abort", abort, { once: true });
    operation.then(
      value => { signal.removeEventListener("abort", abort); resolve(value); },
      error => { signal.removeEventListener("abort", abort); reject(error); },
    );
    if (signal.aborted) {
      signal.removeEventListener("abort", abort);
      abort();
    }
  });
}

export function createDeadline(
  timeoutMs: number,
  parent?: AbortSignal,
): { signal: AbortSignal; dispose: () => void } {
  const controller = new AbortController();
  const timer = setTimeout(() => {
    controller.abort(new DOMException("Operation deadline exceeded", "TimeoutError"));
  }, timeoutMs);
  timer.unref();
  return {
    signal: parent ? AbortSignal.any([parent, controller.signal]) : controller.signal,
    dispose: () => clearTimeout(timer),
  };
}
