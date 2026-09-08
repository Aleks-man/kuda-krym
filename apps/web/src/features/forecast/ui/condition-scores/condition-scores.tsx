import type { BeachForecast } from "@kuda-krym/contracts";
import type { CSSProperties } from "react";

import {
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
      <p className={styles.title}>{title}</p>
      <div
        aria-label={value === null ? "Оценка недоступна" : `${value} из 100`}
        className={`${styles.result} ${value === null ? styles.resultUnavailable : ""}`}
        style={{ "--score": value ?? 0 } as CSSProperties}
      >
        <strong>{value === null ? "—" : `${value}/100`}</strong>
      </div>
      <p className={styles.label}>{getScoreLabel(value)}</p>
      <p className={styles.explanation}>{getScoreExplanation(score)}</p>
    </article>
  );
}
