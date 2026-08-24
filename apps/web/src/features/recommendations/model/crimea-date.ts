export type RelativeRecommendationDate = "today" | "tomorrow";

const crimeaTimeZone = "Europe/Moscow";

function formatCrimeaDate(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: crimeaTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function resolveRecommendationDate(
  relativeDate: RelativeRecommendationDate,
  now = new Date(),
) {
  const offsetDays = relativeDate === "tomorrow" ? 1 : 0;
  return formatCrimeaDate(new Date(now.getTime() + offsetDays * 86_400_000));
}
