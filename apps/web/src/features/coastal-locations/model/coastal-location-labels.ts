import type { CoastalLocation } from "@kuda-krym/contracts";

type CoastalRegion = CoastalLocation["region"];
type WaterBody = CoastalLocation["waterBody"];

export const coastalRegionLabels: Record<CoastalRegion, string> = {
  WEST_CRIMEA: "Западный Крым",
  SOUTH_COAST: "Южный берег",
  EAST_CRIMEA: "Восточный Крым",
  SEVASTOPOL: "Севастополь",
  KERCH_PENINSULA: "Керченский полуостров",
};

export const coastalRegionOrder: readonly CoastalRegion[] = [
  "WEST_CRIMEA",
  "SEVASTOPOL",
  "SOUTH_COAST",
  "EAST_CRIMEA",
  "KERCH_PENINSULA",
];

export const waterBodyLabels: Record<WaterBody, string> = {
  BLACK_SEA: "Чёрное море",
  AZOV_SEA: "Азовское море",
  KERCH_STRAIT: "Керченский пролив",
};
