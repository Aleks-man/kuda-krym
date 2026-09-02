import type { BeachListItem } from "@kuda-krym/contracts";
import Image from "next/image";
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
      <div className={styles.visual}>
        {beach.coverImage ? (
          <Image
            className={styles.image}
            src={beach.coverImage.url}
            alt={beach.coverImage.alt}
            fill
            sizes="(max-width: 680px) 100vw, (max-width: 1100px) 50vw, 33vw"
          />
        ) : (
          <span className={styles.fallback} aria-hidden="true" />
        )}
        <span className={styles.shade} aria-hidden="true" />
        <span className={styles.imageLabel}>
          {beach.coverImage?.context === "COASTAL_LOCATION"
            ? "Фото побережья"
            : "Море рядом"}
        </span>
      </div>
      <div className={styles.content}>
        <p className={styles.region}>{labels.region}</p>
        <h2 className={styles.title}>{beach.name}</h2>
        <p className={styles.locality}>{beach.locality ?? labels.region}</p>
        {labels.facts.length > 0 ? (
          <ul className={styles.facts}>
            {labels.facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        ) : null}
        <Link className={styles.link} href={`/beaches/${beach.slug}`}>
          Подробнее <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

