import Image from "next/image";
import Link from "next/link";

import { ImageCredit } from "@/shared/ui/image-credit/image-credit";
import type { WeatherCity } from "../../model/cities";
import styles from "./city-hero.module.css";

export function CityHero({ city }: Readonly<{ city: WeatherCity }>) {
  return (
    <header className={styles.hero} data-without-image={!city.coverImage || undefined}>
      <div className={styles.copy}>
        <Link className={styles.back} href="/coast">← К карте Крыма</Link>
        <p className={styles.eyebrow}>{city.kind === "city" ? "Погода в городе" : "Погода в посёлке"}</p>
        <h1>{city.name}</h1>
        <p className={styles.area}>{city.areaLabel}</p>
        <p className={styles.description}>
          Температура, облачность, осадки и ветер на ближайшие семь дней.
        </p>
      </div>
      {city.coverImage ? <figure className={styles.visual}>
        <Image className={styles.image} src={city.coverImage.url} alt={city.coverImage.alt} fill priority sizes="(max-width: 820px) calc(100vw - 40px), 560px" />
        <span className={styles.shade} aria-hidden="true" />
        <figcaption className={styles.caption}><ImageCredit image={city.coverImage} /></figcaption>
      </figure> : null}
    </header>
  );
}
