const maximumComparedBeaches = 3;

export function normalizeComparisonSlugs(value: string | string[] | undefined) {
  const rawValue = Array.isArray(value) ? value.join(",") : (value ?? "");

  return [...new Set(rawValue.split(",").map((slug) => slug.trim()).filter(Boolean))]
    .slice(0, maximumComparedBeaches);
}
