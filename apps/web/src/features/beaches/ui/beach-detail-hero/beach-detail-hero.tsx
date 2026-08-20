import type { BeachDetail } from "@kuda-krym/contracts";
import Link from "next/link";

import { getBeachLabels } from "../../model/beach-labels";
import styles from "./beach-detail-hero.module.css";

type BeachDetailHeroProps = Readonly<{ beach: BeachDetail }>;

export function BeachDetailHero({ beach }: BeachDetailHeroProps) {
  const labels = getBeachLabels(beach);

  return (
    <section className={styles.hero}>
      <div className={styles.copy}>
        <Link className={styles.back} href="/beaches">
          ← Все пляжи
        </Link>
        <p className={styles.region}>{labels.region}</p>
        <h1>{beach.name}</h1>
        <p className={styles.locality}>{beach.locality ?? labels.region}</p>
        <p className={styles.description}>
          {beach.description ??
            "Собираем и проверяем сведения об этом месте. Уже можно изучить расположение и подтверждённые источники."}
        </p>
      </div>
      <div className={styles.visual} aria-label="Морской пейзаж">
        <span>Крымское побережье</span>
      </div>
    </section>
  );
}
