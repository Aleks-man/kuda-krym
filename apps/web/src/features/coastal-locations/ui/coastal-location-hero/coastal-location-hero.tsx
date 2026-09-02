import Link from "next/link";
import type { CoastalLocation } from "@kuda-krym/contracts";
import Image from "next/image";

import { ImageCredit } from "@/shared/ui/image-credit/image-credit";

import {
  coastalRegionLabels,
  waterBodyLabels,
} from "../../model/coastal-location-labels";
import styles from "./coastal-location-hero.module.css";

type CoastalLocationHeroProps = Readonly<{
  location: CoastalLocation;
}>;

export function CoastalLocationHero({ location }: CoastalLocationHeroProps) {
  return (
    <header className={styles.hero}>
      <div className={styles.copy}>
        <Link className={styles.back} href="/coast">
          ← Всё побережье
        </Link>
        <p className={styles.eyebrow}>
          {coastalRegionLabels[location.region]} ·{" "}
          {waterBodyLabels[location.waterBody]}
        </p>
        <h1>{location.name}</h1>
        <p className={styles.description}>
          Актуальные условия у моря: температура воздуха и воды, ветер, осадки и
          волны.
        </p>
      </div>

      <figure className={styles.visual}>
        {location.coverImage ? (
          <>
            <Image
              className={styles.image}
              src={location.coverImage.url}
              alt={location.coverImage.alt}
              fill
              priority
              sizes="(max-width: 820px) 100vw, 48vw"
            />
            <span className={styles.shade} aria-hidden="true" />
            <figcaption className={styles.caption}>
              <ImageCredit image={location.coverImage} />
            </figcaption>
          </>
        ) : (
          <span className={styles.fallback} aria-hidden="true" />
        )}
      </figure>
    </header>
  );
}
