import type { RelativeRecommendationDate } from "./crimea-date";
import { timeOptions } from "./preference-options";

export type RecommendationTime = (typeof timeOptions)[number]["value"];

const crimeaTimeZone = "Europe/Moscow";
const minimumRemainingMinutes = 60;

export function getUnavailableRecommendationTimes(
  relativeDate: RelativeRecommendationDate,
  now: Date,
): ReadonlySet<RecommendationTime> {
  if (relativeDate !== "today") return new Set();

  const currentMinutes = getCrimeaMinutesSinceMidnight(now);

  return new Set(
    timeOptions
      .filter(
        ({ endHour }) =>
          currentMinutes >= endHour * 60 - minimumRemainingMinutes,
      )
      .map(({ value }) => value),
  );
}

export function isTodayUnavailable(now: Date): boolean {
  return (
    getUnavailableRecommendationTimes("today", now).size ===
    timeOptions.length
  );
}

export function getFirstAvailableRecommendationTime(
  relativeDate: RelativeRecommendationDate,
  now: Date,
): RecommendationTime {
  const unavailable = getUnavailableRecommendationTimes(relativeDate, now);
  const firstAvailable = timeOptions.find(
    ({ value }) => !unavailable.has(value),
  );

  return firstAvailable?.value ?? "day";
}

function getCrimeaMinutesSinceMidnight(now: Date): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: crimeaTimeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const hour = Number(parts.find(({ type }) => type === "hour")?.value);
  const minute = Number(parts.find(({ type }) => type === "minute")?.value);

  return hour * 60 + minute;
}
