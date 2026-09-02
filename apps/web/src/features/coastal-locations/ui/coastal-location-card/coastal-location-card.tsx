import type { CoastalLocation } from "@kuda-krym/contracts";
import Image from "next/image";
import Link from "next/link";

import { waterBodyLabels } from "../../model/coastal-location-labels";
import styles from "./coastal-location-card.module.css";

type CoastalLocationCardProps = Readonly<{
  location: CoastalLocation;
}>;

export function CoastalLocationCard({ location }: CoastalLocationCardProps) {
  return (
    <Link className={styles.card} href={`/coast/${location.slug}`}>
      {location.coverImage ? (
        <Image
          className={styles.image}
          src={location.coverImage.url}
          alt={location.coverImage.alt}
          fill
          sizes="(max-width: 680px) 100vw, (max-width: 1100px) 50vw, 33vw"
        />
      ) : (
        <span className={styles.fallback} aria-hidden="true" />
      )}

      <span className={styles.shade} aria-hidden="true" />
      <span className={styles.content}>
        <span className={styles.waterBody}>
          {waterBodyLabels[location.waterBody]}
        </span>
        <strong>{location.name}</strong>
      </span>
      <span className={styles.arrow} aria-hidden="true">
        →
      </span>
    </Link>
  );
}
