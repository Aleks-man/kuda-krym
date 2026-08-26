export function calculateCircularSpread(degrees: readonly number[]): number {
  if (degrees.length < 2) return 0;

  const sorted = degrees
    .map((value) => ((value % 360) + 360) % 360)
    .sort((left, right) => left - right);
  let largestGap = 0;

  for (let index = 1; index < sorted.length; index += 1) {
    largestGap = Math.max(largestGap, sorted[index]! - sorted[index - 1]!);
  }
  largestGap = Math.max(
    largestGap,
    sorted[0]! + 360 - sorted.at(-1)!,
  );

  return 360 - largestGap;
}
