import type { ForecastConfidence as ForecastConfidenceData } from "@kuda-krym/contracts";

import {
  confidenceFactorPresentation,
  confidenceLevelLabels,
  getConfidenceExplanation,
} from "../../model/confidence-presentation";
import styles from "./forecast-confidence.module.css";

type ForecastConfidenceProps = Readonly<{
  confidence: ForecastConfidenceData;
}>;

export function ForecastConfidence({ confidence }: ForecastConfidenceProps) {
  return (
    <section className={styles.panel} aria-labelledby="confidence-title">
      <div className={styles.overview}>
        <p>Надёжность прогноза</p>
        <div className={styles.score}>
          <strong>{confidence.score}</strong>
          <span>%</span>
        </div>
        <h3 id="confidence-title">
          {confidenceLevelLabels[confidence.level]}
        </h3>
        <span className={styles.explanation}>
          {getConfidenceExplanation(confidence)}
        </span>
      </div>

      <ul className={styles.factors}>
        {confidence.factors.map((factor) => {
          const presentation = confidenceFactorPresentation[factor.name];

          return (
            <li key={factor.name}>
              <div className={styles.factorHeading}>
                <strong>{presentation.label}</strong>
                <span>{factor.score}%</span>
              </div>
              <div
                className={styles.track}
                role="progressbar"
                aria-label={presentation.label}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={factor.score}
              >
                <span style={{ width: `${factor.score}%` }} />
              </div>
              <p>{presentation.description}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
