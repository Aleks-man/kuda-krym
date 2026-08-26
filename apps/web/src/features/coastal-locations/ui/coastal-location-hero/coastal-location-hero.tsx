import Link from "next/link";
import type { CoastalLocation } from "@kuda-krym/contracts";

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
      <Link className={styles.back} href="/coast">
        ← Всё побережье
      </Link>
      <p className={styles.eyebrow}>
        {coastalRegionLabels[location.region]} · {waterBodyLabels[location.waterBody]}
      </p>
      <h1>{location.name}</h1>
      <p className={styles.description}>
        Актуальные условия у моря: температура воздуха и воды, ветер, осадки и волны.
      </p>
    </header>
  );
}
