import { describe, expect, it } from "vitest";

import { mapWithConcurrency } from "../../src/shared/async/map-with-concurrency.js";

describe("mapWithConcurrency", () => {
  it("preserves order and respects the concurrency limit", async () => {
    let active = 0;
    let maximumActive = 0;

    const result = await mapWithConcurrency([1, 2, 3, 4, 5], 2, async (item) => {
      active += 1;
      maximumActive = Math.max(maximumActive, active);
      await new Promise((resolve) => setTimeout(resolve, 2));
      active -= 1;
      return item * 2;
    });

    expect(result).toEqual([2, 4, 6, 8, 10]);
    expect(maximumActive).toBe(2);
  });

  it("rejects an invalid concurrency value", async () => {
    await expect(
      mapWithConcurrency([1], 0, async (item) => item),
    ).rejects.toThrow("positive integer");
  });
});
