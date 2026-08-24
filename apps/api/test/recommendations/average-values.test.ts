import { describe, expect, it } from "vitest";

import { averageValues } from "../../src/modules/recommendations/summaries/average-values.js";

describe("averageValues", () => {
  it("ignores missing values and rounds to one decimal", () => {
    expect(averageValues([1, null, 2.25])).toBe(1.6);
  });

  it("returns null when every value is missing", () => {
    expect(averageValues([null, null])).toBeNull();
  });
});
