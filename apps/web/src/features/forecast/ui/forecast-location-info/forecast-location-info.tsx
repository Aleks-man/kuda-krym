import type { CoastalLocation } from "@kuda-krym/contracts";
import type { WeatherCity } from "@/features/cities/model/cities";
import { coastalRegionLabels, waterBodyLabels } from "@/features/coastal-locations/model/coastal-location-labels";
import styles from "./forecast-location-info.module.css";
function point(coordinates: { latitude: number; longitude: number }) {
  return `${coordinates.latitude.toFixed(4)}° с. ш., ${coordinates.longitude.toFixed(4)}° в. д.`;
}
export function ForecastLocationInfo({ location }: Readonly<{ location: CoastalLocation | WeatherCity }>) {
  const coastal = "waterBody" in location;
  return <section className={styles.section} aria-labelledby="forecast-location-info-title">
    <h2 id="forecast-location-info-title">О прогнозе: {location.name}</h2>
    {coastal ? <>
      <p>{location.name} — {coastalRegionLabels[location.region]}, {waterBodyLabels[location.waterBody]}. Погода рассчитана для точки {point(location.weatherCoordinates)}; морские условия — для точки {point(location.marineCoordinates)}.</p>
      <p>Температура воды и высота волн относятся к морской точке прогноза. У берега и в защищённых бухтах условия могут отличаться. Сравните прогноз с пляжами поблизости перед поездкой.</p>
    </> : <p>{location.name} — {location.areaLabel}. Прогноз температуры воздуха, осадков и ветра рассчитан для точки {point(location.coordinates)}. На этой странице показана погода в населённом пункте; морские условия смотрите в прогнозах побережья.</p>}
    <p>Источник — погодные модели Open-Meteo. Это расчётный прогноз, а не измерение местной метеостанции. Время указано по Москве; дата обновления и доступность данных отмечены в блоке прогноза.</p>
  </section>;
}
