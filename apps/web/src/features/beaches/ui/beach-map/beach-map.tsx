import type { BeachListItem } from "@kuda-krym/contracts";
import {
  InteractiveMap,
  type MapPoint,
} from "@/shared/ui/interactive-map/interactive-map";
import styles from "./beach-map.module.css";

type BeachMapProps = Readonly<{
  beaches: readonly BeachListItem[];
}>;

const crimeaCenter = [45.15, 34.35] as const;

export function BeachMap({ beaches }: BeachMapProps) {
  const points: MapPoint[] = beaches.map((beach) => ({
    id: beach.id,
    label: beach.name,
    description: beach.locality ?? undefined,
    href: `/beaches/${beach.slug}`,
    actionLabel: "Открыть пляж",
    position: [
      beach.coordinates.latitude,
      beach.coordinates.longitude,
    ],
  }));

  return (
    <section className={styles.section} aria-labelledby="beaches-map-title">
      <header>
        <p>На карте</p>
        <h2 id="beaches-map-title">Конкретные пляжи на карте</h2>
        <span>
          Нажмите на группу, чтобы приблизить карту, или на точку, чтобы открыть
          пляж.
        </span>
      </header>
      <InteractiveMap
        ariaLabel="Карта опубликованных пляжей Крыма"
        center={[...crimeaCenter]}
        clusterPoints
        points={points}
        zoom={8}
      />
    </section>
  );
}
