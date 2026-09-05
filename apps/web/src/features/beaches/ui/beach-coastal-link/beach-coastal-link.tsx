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
        <p className={styles.eyebrow}>Связь с побережьем</p>
        <h2 id="coastal-context-title">Точный прогноз для пляжа</h2>
        <p className={styles.description}>
          Условия на этой странице рассчитаны для координат пляжа. Общую картину
          погоды и моря в районе смотрите в прогнозе для {coastalLocation.name}.
        </p>
      </div>
      <Link href={`/coast/${coastalLocation.slug}`}>
        Прогноз для {coastalLocation.name} <span aria-hidden="true">→</span>
      </Link>
    </aside>
  );
}
