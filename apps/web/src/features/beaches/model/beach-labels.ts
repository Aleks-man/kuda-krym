import type { BeachListItem } from "@kuda-krym/contracts";

const regionLabels: Record<BeachListItem["region"], string> = {
  WEST_CRIMEA: "Западный Крым",
  SOUTH_COAST: "Южный берег",
  EAST_CRIMEA: "Восточный Крым",
  SEVASTOPOL: "Севастополь",
  KERCH_PENINSULA: "Керченский полуостров",
};

const surfaceLabels: Partial<Record<BeachListItem["surface"], string>> = {
  SAND: "Песок",
  PEBBLE: "Галька",
  MIXED: "Смешанное покрытие",
  ROCK: "Скалы",
};

const childSuitabilityLabels: Partial<
  Record<BeachListItem["childSuitability"], string>
> = {
  SUITABLE: "Подходит для детей",
  LIMITED: "Для детей с ограничениями",
  UNSUITABLE: "Не подходит для детей",
};

export function getBeachRegionLabel(
  region: BeachListItem["region"],
): string {
  return regionLabels[region];
}

export function getBeachLabels(beach: BeachListItem) {
  return {
    region: getBeachRegionLabel(beach.region),
    facts: [
      surfaceLabels[beach.surface],
      childSuitabilityLabels[beach.childSuitability],
    ].filter((value): value is string => value !== undefined),
  };
}

