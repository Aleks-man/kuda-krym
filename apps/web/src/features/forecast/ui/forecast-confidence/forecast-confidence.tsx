import type { ForecastConfidence as ForecastConfidenceData } from "@kuda-krym/contracts";
import type { CSSProperties } from "react";

import styles from "./forecast-confidence.module.css";

type ForecastConfidenceProps = Readonly<{
  confidence: ForecastConfidenceData;
}>;

export function ForecastConfidence({ confidence }: ForecastConfidenceProps) {
  return (
    <section className={styles.panel} aria-labelledby="confidence-title">
      <h3 id="confidence-title">Надёжность прогноза</h3>
      <div
        aria-label="Надёжность прогноза"
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={confidence.score}
        className={styles.score}
        role="progressbar"
        style={{ "--score": confidence.score } as CSSProperties}
      >
        <strong>{confidence.score}%</strong>
      </div>
    </section>
  );
}
