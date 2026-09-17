import type { BeachDetail } from "@kuda-krym/contracts";
import Link from "next/link";

import styles from "./beach-coastal-link.module.css";

type BeachCoastalLinkProps = Readonly<{
  coastalLocation: BeachDetail["coastalLocation"];
}>;

export function BeachCoastalLink({
  coastalLocation,
}: BeachCoastalLinkProps) {
  if (!coastalLocation) {
    return null;
  }

  return (
    <aside className={styles.card} aria-labelledby="coastal-context-title">
      <div>
        <p className={styles.eyebrow}>Прогноз по району</p>
        <h2 id="coastal-context-title">Погода у моря — {coastalLocation.name}</h2>
        <p className={styles.description}>
          Посмотрите прогноз погоды, ветра, волн и температуры моря для этого района.
        </p>
      </div>
      <Link
        aria-label={`Открыть прогноз по району ${coastalLocation.name}`}
        className={styles.cardLink}
        href={`/coast/${coastalLocation.slug}`}
      >
        Открыть прогноз <span aria-hidden="true">→</span>
      </Link>
    </aside>
  );
}
