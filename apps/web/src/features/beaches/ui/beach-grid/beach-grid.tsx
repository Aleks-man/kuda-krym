import type { BeachListItem } from "@kuda-krym/contracts";

import { BeachCard } from "../beach-card/beach-card";
import styles from "./beach-grid.module.css";

type BeachGridProps = Readonly<{
  beaches: BeachListItem[];
}>;

export function BeachGrid({ beaches }: BeachGridProps) {
  return (
    <div className={styles.grid}>
      {beaches.map((beach) => (
        <BeachCard beach={beach} key={beach.id} />
      ))}
    </div>
  );
}

