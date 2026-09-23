import { inlandForecastLocations, type CoastalLocation } from "@kuda-krym/contracts";

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
  const coastalPoints: MapPoint[] = locations.map((location) => ({
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
  const points: MapPoint[] = [...coastalPoints, ...inlandForecastLocations.map((city): MapPoint => ({
    id: `city-${city.slug}`,
    label: city.name,
    description: city.areaLabel,
    href: `/cities/${city.slug}`,
    actionLabel: "Смотреть погоду",
    position: [city.coordinates.latitude, city.coordinates.longitude],
    variant: "city",
  }))];

  return (
    <section className={styles.section} aria-labelledby="coast-map-title">
      <header>
        <p>Весь полуостров</p>
        <h2 id="coast-map-title">Населённые пункты Крыма на карте</h2>
        <span>
          Прогноз погоды для городов и посёлков. На побережье — также волны и температура моря.
        </span>
      </header>
      <InteractiveMap
        ariaLabel="Карта населённых пунктов Крыма"
        center={[...crimeaCenter]}
        points={points}
        zoom={8}
      />
    </section>
  );
}
