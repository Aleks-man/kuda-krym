import { describe, expect, it } from "vitest";

import { scoreByCurve } from "../../src/modules/scoring/score-curve.js";

describe("scoreByCurve", () => {
  const curve = [[0, 100], [10, 50], [20, 0]] as const;

  it("interpolates between configured points", () => {
    expect(scoreByCurve(5, curve)).toBe(75);
    expect(scoreByCurve(15, curve)).toBe(25);
  });

  it("clamps values outside the configured range", () => {
    expect(scoreByCurve(-5, curve)).toBe(100);
    expect(scoreByCurve(25, curve)).toBe(0);
  });
});
