import Image from "next/image";
import Link from "next/link";

import { ImageCredit } from "@/shared/ui/image-credit/image-credit";
import { simferopol } from "../../model/cities";
import styles from "./city-hero.module.css";

export function CityHero() {
  return (
    <header className={styles.hero}>
      <div className={styles.copy}>
        <Link className={styles.back} href="/coast">← К карте Крыма</Link>
        <p className={styles.eyebrow}>Погода в городе</p>
        <h1>{simferopol.name}</h1>
        <p className={styles.description}>
          Температура, облачность, осадки и ветер на ближайшие три дня.
        </p>
      </div>
      <figure className={styles.visual}>
        <Image className={styles.image} src={simferopol.coverImage.url} alt={simferopol.coverImage.alt} fill priority sizes="(max-width: 820px) calc(100vw - 40px), 560px" />
        <span className={styles.shade} aria-hidden="true" />
        <figcaption className={styles.caption}><ImageCredit image={simferopol.coverImage} /></figcaption>
      </figure>
    </header>
  );
}
