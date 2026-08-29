import type { CoastalLocation } from "@kuda-krym/contracts";

import {
  InteractiveMap,
  type MapPoint,
} from "@/shared/ui/interactive-map/interactive-map";

import { waterBodyLabels } from "../../model/coastal-location-labels";
import styles from "./coastal-location-map.module.css";

type CoastalLocationMapProps = Readonly<{
  locations: readonly CoastalLocation[];
}>;

const crimeaCenter = [45.15, 34.35] as const;

export function CoastalLocationMap({ locations }: CoastalLocationMapProps) {
  const points: MapPoint[] = locations.map((location) => ({
    id: location.id,
    label: location.name,
    description: waterBodyLabels[location.waterBody],
    href: `/coast/${location.slug}`,
    actionLabel: "Смотреть прогноз",
    position: [
      location.weatherCoordinates.latitude,
      location.weatherCoordinates.longitude,
    ],
  }));

  return (
    <section className={styles.section} aria-labelledby="coast-map-title">
      <header>
        <p>Весь полуостров</p>
        <h2 id="coast-map-title">Прибрежные города на карте</h2>
        <span>
          Каждая точка — отдельная зона прогноза погоды, ветра, волн и состояния моря.
        </span>
      </header>
      <InteractiveMap
        ariaLabel="Карта прибрежных локаций Крыма"
        center={[...crimeaCenter]}
        points={points}
        zoom={8}
      />
    </section>
  );
}
