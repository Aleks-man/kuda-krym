import type { BeachForecast } from "@kuda-krym/contracts";

import {
  getConfidenceLabel,
  getScoreExplanation,
  getScoreLabel,
  type ConditionsScore,
} from "../../model/score-presentation";
import styles from "./condition-scores.module.css";

type ForecastScores = BeachForecast["hourly"][number]["scores"];

export function ConditionScores({
  scores,
}: Readonly<{ scores: ForecastScores }>) {
  return (
    <div className={styles.grid} aria-label="Оценка текущих условий">
      <ScoreCard title="Состояние моря" score={scores.sea} />
      <ScoreCard title="Погодный комфорт" score={scores.weather} />
    </div>
  );
}

function ScoreCard({
  title,
  score,
}: Readonly<{ title: string; score: ConditionsScore }>) {
  const value = score.score;

  return (
    <article className={styles.card}>
      <div className={styles.topline}>
        <p>{title}</p>
        <span>{getConfidenceLabel(score.coveragePercent)}</span>
      </div>
      <div className={styles.result}>
        <strong>{value ?? "—"}</strong>
        <span>/ 100</span>
      </div>
      <p className={styles.label}>{getScoreLabel(value)}</p>
      <p className={styles.explanation}>{getScoreExplanation(score)}</p>
      <div className={styles.coverage}>
        <span style={{ width: `${score.coveragePercent}%` }} />
      </div>
      <small>Покрытие данных: {score.coveragePercent}%</small>
    </article>
  );
}
