export function averageValues(
  values: readonly (number | null)[],
): number | null {
  const available = values.filter((value): value is number => value !== null);
  if (available.length === 0) return null;

  const average = available.reduce((sum, value) => sum + value, 0) / available.length;
  return Math.round(average * 10) / 10;
}
