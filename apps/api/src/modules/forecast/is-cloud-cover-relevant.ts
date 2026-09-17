import type { DailySunTimes } from "../weather/weather-forecast.js";

const twilightMinutes = 30;
const twilightMilliseconds = twilightMinutes * 60 * 1_000;

export function isCloudCoverRelevant(
  forecastTime: string,
  sunTimes: readonly DailySunTimes[] | undefined,
): boolean {
  const date = forecastTime.slice(0, 10);
  const daylight = sunTimes?.find((item) => item.date === date);

  if (!daylight) return true;

  const forecastTimestamp = parseUtcTimestamp(forecastTime);
  const sunriseTimestamp = parseUtcTimestamp(daylight.sunrise);
  const sunsetTimestamp = parseUtcTimestamp(daylight.sunset);

  if (
    forecastTimestamp === null ||
    sunriseTimestamp === null ||
    sunsetTimestamp === null
  ) {
    return true;
  }

  return (
    forecastTimestamp >= sunriseTimestamp - twilightMilliseconds &&
    forecastTimestamp < sunsetTimestamp + twilightMilliseconds
  );
}

function parseUtcTimestamp(value: string): number | null {
  const timestamp = Date.parse(`${value}Z`);
  return Number.isNaN(timestamp) ? null : timestamp;
}