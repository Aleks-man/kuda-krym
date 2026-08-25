import type { CoastalLocation } from "@kuda-krym/contracts";

import {
  coastalRegionLabels,
  coastalRegionOrder,
  waterBodyLabels,
} from "../../model/coastal-location-labels";
import styles from "./coastal-location-groups.module.css";

type CoastalLocationGroupsProps = Readonly<{
  locations: readonly CoastalLocation[];
}>;

export function CoastalLocationGroups({ locations }: CoastalLocationGroupsProps) {
  return (
    <section className={styles.section} aria-labelledby="coast-list-title">
      <header className={styles.heading}>
        <p>География прогноза</p>
        <h2 id="coast-list-title">Все прибрежные локации</h2>
      </header>

      <div className={styles.groups}>
        {coastalRegionOrder.map((region) => {
          const regionLocations = locations.filter(
            (location) => location.region === region,
          );

          if (regionLocations.length === 0) return null;

          return (
            <section className={styles.group} key={region}>
              <div className={styles.groupHeading}>
                <h3>{coastalRegionLabels[region]}</h3>
                <span>{regionLocations.length}</span>
              </div>
              <ul className={styles.list}>
                {regionLocations.map((location) => (
                  <li className={styles.card} key={location.id}>
                    <span className={styles.marker} aria-hidden="true" />
                    <div>
                      <strong>{location.name}</strong>
                      <span>{waterBodyLabels[location.waterBody]}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </section>
  );
}
