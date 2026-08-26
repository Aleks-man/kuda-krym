import type {
  ForecastConfidence,
  ForecastConfidenceFactor,
} from "@kuda-krym/contracts";

export const confidenceLevelLabels: Record<
  ForecastConfidence["level"],
  string
> = {
  HIGH: "Высокая уверенность",
  MEDIUM: "Средняя уверенность",
  LOW: "Низкая уверенность",
};

export const confidenceFactorPresentation: Record<
  ForecastConfidenceFactor["name"],
  Readonly<{ label: string; description: string }>
> = {
  FRESHNESS: {
    label: "Свежесть",
    description: "Насколько недавно источники обновили расчёт.",
  },
  HORIZON: {
    label: "Горизонт",
    description: "Ближайшие часы обычно прогнозируются точнее.",
  },
  COMPLETENESS: {
    label: "Полнота",
    description: "Достаточно ли данных о погоде, ветре и море.",
  },
};

export function getConfidenceExplanation(
  confidence: ForecastConfidence,
): string {
  const weakest = confidence.factors.reduce((lowest, factor) =>
    factor.score < lowest.score ? factor : lowest,
  );
  const weakestLabel = confidenceFactorPresentation[weakest.name].label.toLowerCase();

  if (confidence.level === "HIGH") {
    return "Данные свежие и достаточно полные для выбранного часа.";
  }

  return `Уверенность снижает ${weakestLabel} прогноза.`;
}
