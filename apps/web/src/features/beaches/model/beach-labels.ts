import type { BeachListItem } from "@kuda-krym/contracts";

const regionLabels: Record<BeachListItem["region"], string> = {
  WEST_CRIMEA: "Западный Крым",
  SOUTH_COAST: "Южный берег",
  EAST_CRIMEA: "Восточный Крым",
  SEVASTOPOL: "Севастополь",
  KERCH_PENINSULA: "Керченский полуостров",
};

const surfaceLabels: Record<BeachListItem["surface"], string> = {
  UNKNOWN: "Покрытие уточняется",
  SAND: "Песок",
  PEBBLE: "Галька",
  MIXED: "Смешанное покрытие",
  ROCK: "Скалы",
};

const childSuitabilityLabels: Record<
  BeachListItem["childSuitability"],
  string
> = {
  UNKNOWN: "Для детей: нет проверенных данных",
  SUITABLE: "Подходит для детей",
  LIMITED: "Для детей с ограничениями",
  UNSUITABLE: "Не подходит для детей",
};

export function getBeachLabels(beach: BeachListItem) {
  return {
    region: regionLabels[beach.region],
    surface: surfaceLabels[beach.surface],
    childSuitability: childSuitabilityLabels[beach.childSuitability],
  };
}

