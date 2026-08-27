import { describe, expect, it, vi } from "vitest";

import { InMemoryRequestCoalescer } from "../../src/shared/async/request-coalescer.js";

describe("InMemoryRequestCoalescer", () => {
  it("shares one in-flight operation between requests with the same key", async () => {
    let resolveOperation!: (value: string) => void;
    const operation = new Promise<string>((resolve) => {
      resolveOperation = resolve;
    });
    const task = vi.fn(() => operation);
    const coalescer = new InMemoryRequestCoalescer();

    const requests = [
      coalescer.run("forecast:weather", task),
      coalescer.run("forecast:weather", task),
      coalescer.run("forecast:weather", task),
    ];
    resolveOperation("forecast");

    await expect(Promise.all(requests)).resolves.toEqual([
      "forecast",
      "forecast",
      "forecast",
    ]);
    expect(task).toHaveBeenCalledOnce();
  });

  it("runs different keys independently", async () => {
    const task = vi.fn(async (value: string) => value);
    const coalescer = new InMemoryRequestCoalescer();

    await expect(
      Promise.all([
        coalescer.run("weather:first", () => task("first")),
        coalescer.run("weather:second", () => task("second")),
      ]),
    ).resolves.toEqual(["first", "second"]);
    expect(task).toHaveBeenCalledTimes(2);
  });

  it("allows a new operation after the previous one completes", async () => {
    const task = vi.fn(async () => "forecast");
    const coalescer = new InMemoryRequestCoalescer();

    await coalescer.run("forecast:weather", task);
    await coalescer.run("forecast:weather", task);

    expect(task).toHaveBeenCalledTimes(2);
  });

  it("clears a failed operation so it can be retried", async () => {
    const task = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(new Error("upstream failed"))
      .mockResolvedValueOnce("recovered");
    const coalescer = new InMemoryRequestCoalescer();

    await expect(coalescer.run("forecast:weather", task)).rejects.toThrow(
      "upstream failed",
    );
    await expect(coalescer.run("forecast:weather", task)).resolves.toBe(
      "recovered",
    );
    expect(task).toHaveBeenCalledTimes(2);
  });
});
