import { describe, expect, it } from "vitest";

import { calculateCircularSpread } from "../../src/modules/weather/models/agreement/calculate-circular-spread.js";

describe("calculateCircularSpread", () => {
  it("uses the shortest arc across north", () => {
    expect(calculateCircularSpread([350, 10, 5])).toBe(20);
  });

  it("handles opposite and identical directions", () => {
    expect(calculateCircularSpread([0, 180])).toBe(180);
    expect(calculateCircularSpread([90, 90, 90])).toBe(0);
  });
});
