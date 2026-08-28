import type { BeachDetail } from "@kuda-krym/contracts";

import { getBeachDetailFacts } from "../../model/beach-detail-labels";
import styles from "./beach-facts.module.css";

export function BeachFacts({ beach }: Readonly<{ beach: BeachDetail }>) {
  const facts = getBeachDetailFacts(beach);
  if (facts.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <p>Характеристики</p>
        <h2>Что известно о пляже</h2>
      </div>
      <dl className={styles.grid}>
        {facts.map((fact) => (
          <div className={styles.fact} key={fact.label}>
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
