import type { BeachDetail } from "@kuda-krym/contracts";
import Image from "next/image";
import Link from "next/link";

import { ImageCredit } from "@/shared/ui/image-credit/image-credit";

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
      <figure className={styles.visual}>
        {beach.coverImage ? (
          <>
            <Image
              className={styles.image}
              src={beach.coverImage.url}
              alt={beach.coverImage.alt}
              fill
              priority
              sizes="(max-width: 820px) 100vw, 48vw"
            />
            <span className={styles.shade} aria-hidden="true" />
            <figcaption className={styles.caption}>
              {beach.coverImage.context === "COASTAL_LOCATION" ? (
                <span className={styles.context}>Фото побережья рядом</span>
              ) : null}
              <ImageCredit image={beach.coverImage} />
            </figcaption>
          </>
        ) : (
          <>
            <span className={styles.fallback} aria-hidden="true" />
            <figcaption className={styles.fallbackCaption}>
              Крымское побережье
            </figcaption>
          </>
        )}
      </figure>
    </section>
  );
}
