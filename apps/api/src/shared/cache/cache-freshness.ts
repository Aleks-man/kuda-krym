import type {
  ForecastFreshnessStatus,
  ForecastSourceFreshness,
} from "@kuda-krym/contracts";

type GeneratedData = Readonly<{ generatedAt: string }>;

export type FreshnessAware<T extends GeneratedData> = T &
  Readonly<{ freshness: ForecastSourceFreshness }>;

export function markDataFreshness<T extends GeneratedData>(
  data: T,
  status: ForecastFreshnessStatus,
): FreshnessAware<T> {
  return {
    ...data,
    freshness: {
      status,
      generatedAt: data.generatedAt,
    },
  };
}

export function getDataFreshness(
  data: GeneratedData & Readonly<{ freshness?: ForecastSourceFreshness }>,
): ForecastSourceFreshness {
  return data.freshness ?? {
    status: "FRESH",
    generatedAt: data.generatedAt,
  };
}
