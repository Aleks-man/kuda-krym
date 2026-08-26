import type {
  WeatherModel,
  WeatherModelComparisonResponse,
} from "@kuda-krym/contracts";

type Agreement = WeatherModelComparisonResponse["hourly"][number]["agreement"];

export const weatherModelLabels: Record<WeatherModel, string> = {
  ECMWF_IFS: "ECMWF IFS",
  DWD_ICON: "DWD ICON",
  NOAA_GFS: "NOAA GFS",
};

export const agreementLevelLabels: Record<Agreement["level"], string> = {
  HIGH: "Высокая согласованность",
  MEDIUM: "Умеренная согласованность",
  LOW: "Модели расходятся",
  INSUFFICIENT_DATA: "Недостаточно данных",
};

export function findNearestModelComparison(
  comparison: WeatherModelComparisonResponse,
  targetTime: string,
): WeatherModelComparisonResponse["hourly"][number] | null {
  const exact = comparison.hourly.find((hour) => hour.time === targetTime);
  if (exact) return exact;

  return comparison.hourly.reduce<WeatherModelComparisonResponse["hourly"][number] | null>(
    (nearest, hour) => {
      if (!nearest) return hour;
      return Math.abs(Date.parse(`${hour.time}Z`) - Date.parse(`${targetTime}Z`)) <
        Math.abs(Date.parse(`${nearest.time}Z`) - Date.parse(`${targetTime}Z`))
        ? hour
        : nearest;
    },
    null,
  );
}
