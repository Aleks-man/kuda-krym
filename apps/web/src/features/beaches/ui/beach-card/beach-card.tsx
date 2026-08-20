import type { BeachListItem } from "@kuda-krym/contracts";
import Link from "next/link";

import { getBeachLabels } from "../../model/beach-labels";
import styles from "./beach-card.module.css";

type BeachCardProps = Readonly<{
  beach: BeachListItem;
}>;

export function BeachCard({ beach }: BeachCardProps) {
  const labels = getBeachLabels(beach);

  return (
    <article className={styles.card}>
      <div className={styles.image} aria-hidden="true">
        <span>Море рядом</span>
      </div>
      <div className={styles.content}>
        <p className={styles.region}>{labels.region}</p>
        <h2 className={styles.title}>{beach.name}</h2>
        <p className={styles.locality}>{beach.locality ?? labels.region}</p>
        <ul className={styles.facts}>
          <li>{labels.surface}</li>
          <li>{labels.childSuitability}</li>
        </ul>
        <Link className={styles.link} href={`/beaches/${beach.slug}`}>
          Подробнее <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

