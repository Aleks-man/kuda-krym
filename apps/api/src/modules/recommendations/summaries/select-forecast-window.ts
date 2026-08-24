import type { BeachForecast } from "@kuda-krym/contracts";

import type { RecommendationContext } from "../context/recommendation-context.js";

type ForecastHour = BeachForecast["hourly"][number];
type VisitWindow = RecommendationContext["visitWindow"];

export function selectForecastWindow(
  hourly: readonly ForecastHour[],
  window: VisitWindow,
): ForecastHour[] {
  const startsAt = new Date(window.startsAt).getTime();
  const endsAt = new Date(window.endsAt).getTime();

  return hourly.filter((hour) => {
    const time = new Date(`${hour.time}Z`).getTime();
    return time >= startsAt && time <= endsAt;
  });
}
