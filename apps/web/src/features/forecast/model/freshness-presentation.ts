import type { ForecastFreshness } from "@kuda-krym/contracts";

type ForecastSource = keyof ForecastFreshness["sources"];

const sourceLabels: Record<ForecastSource, string> = {
  weather: "погода",
  marine: "состояние моря",
  weatherModels: "сравнение погодных моделей",
};

export type StaleSourcePresentation = Readonly<{
  key: ForecastSource;
  label: string;
  generatedAt: string;
}>;

export function getStaleSources(
  freshness: ForecastFreshness,
): StaleSourcePresentation[] {
  return (Object.entries(freshness.sources) as Array<
    [ForecastSource, ForecastFreshness["sources"][ForecastSource]]
  >).flatMap(([key, source]) =>
    source?.status === "STALE"
      ? [{ key, label: sourceLabels[key], generatedAt: source.generatedAt }]
      : [],
  );
}

export function getOldestStaleUpdate(
  sources: readonly StaleSourcePresentation[],
): string | null {
  if (sources.length === 0) return null;

  return new Date(
    Math.min(...sources.map(({ generatedAt }) => Date.parse(generatedAt))),
  ).toISOString();
}
