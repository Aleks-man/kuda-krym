import type { BeachForecast } from "@kuda-krym/contracts";

type ForecastHour = BeachForecast["hourly"][number];
export type ConditionsScore = ForecastHour["scores"]["sea"];
type ScoreFactor = ConditionsScore["factors"][number];

const factorLabels: Record<ScoreFactor["name"], string> = {
  waveHeight: "высота волны",
  windSpeed: "скорость ветра",
  waterTemperature: "температура воды",
  windGust: "порывы ветра",
  airTemperature: "температура воздуха",
  precipitationProbability: "вероятность осадков",
  precipitationAmount: "количество осадков",
  cloudCover: "облачность",
};

export function getScoreLabel(score: number | null): string {
  if (score === null) return "Недостаточно данных";
  if (score >= 85) return "Отличные условия";
  if (score >= 70) return "Хорошие условия";
  if (score >= 50) return "Условия нестабильны";
  return "Некомфортные условия";
}

export function getConfidenceLabel(coveragePercent: number): string {
  if (coveragePercent >= 90) return "Высокая надёжность";
  if (coveragePercent >= 70) return "Средняя надёжность";
  return "Ограниченные данные";
}

export function getScoreExplanation(score: ConditionsScore): string {
  const availableFactors = score.factors.filter(
    (factor): factor is ScoreFactor & { score: number } =>
      factor.score !== null,
  );
  if (availableFactors.length === 0) {
    return "Модели пока не дали достаточно данных для оценки.";
  }

  const weakest = availableFactors.reduce((lowest, factor) =>
    factor.score < lowest.score ? factor : lowest,
  );
  if (weakest.score >= 85) {
    return "Все доступные показатели находятся в комфортном диапазоне.";
  }

  return `Главный ограничивающий фактор — ${factorLabels[weakest.name]}.`;
}
