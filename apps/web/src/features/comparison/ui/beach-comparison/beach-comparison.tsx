import type { BeachDetail } from "@kuda-krym/contracts";
import Link from "next/link";
import { getBeachDetailFacts } from "@/features/beaches/model/beach-detail-labels";
import { getBeachLabels } from "@/features/beaches/model/beach-labels";
import styles from "./beach-comparison.module.css";

type BeachComparisonProps = {
  beaches: BeachDetail[];
};

export function BeachComparison({ beaches }: BeachComparisonProps) {
  const factsByBeach = beaches.map(getBeachDetailFacts);
  const factLabels = factsByBeach[0]?.map(({ label }) => label) ?? [];

  return (
    <div className={styles.scroller}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Характеристика</th>
            {beaches.map((beach) => (
              <th key={beach.id}>
                <span>{getBeachLabels(beach).region}</span>
                <strong>{beach.name}</strong>
                <Link href={`/beaches/${beach.slug}`}>Открыть карточку →</Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {factLabels.map((label, factIndex) => (
            <tr key={label}>
              <th>{label}</th>
              {beaches.map((beach, beachIndex) => (
                <td key={beach.id}>{factsByBeach[beachIndex]?.[factIndex]?.value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
