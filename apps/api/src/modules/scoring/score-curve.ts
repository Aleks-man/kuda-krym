import type { ScoreCurvePoint } from "./scoring.types.js";

export function scoreByCurve(
  value: number,
  points: readonly ScoreCurvePoint[],
): number {
  if (points.length < 2) {
    throw new Error("A scoring curve requires at least two points");
  }

  const first = points[0]!;
  const last = points.at(-1)!;
  if (value <= first[0]) return first[1];
  if (value >= last[0]) return last[1];

  for (let index = 1; index < points.length; index += 1) {
    const right = points[index]!;
    const left = points[index - 1]!;
    if (value <= right[0]) {
      const position = (value - left[0]) / (right[0] - left[0]);
      return Math.round(left[1] + position * (right[1] - left[1]));
    }
  }

  return last[1];
}
