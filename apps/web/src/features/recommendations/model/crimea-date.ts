export type RelativeRecommendationDate =
  | "today"
  | "tomorrow"
  | "dayAfterTomorrow";

const crimeaTimeZone = "Europe/Moscow";
const dayMilliseconds = 86_400_000;

const relativeDateOffsets: Record<RelativeRecommendationDate, number> = {
  today: 0,
  tomorrow: 1,
  dayAfterTomorrow: 2,
};

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
  const offsetDays = relativeDateOffsets[relativeDate];
  return formatCrimeaDate(new Date(now.getTime() + offsetDays * dayMilliseconds));
}

export function formatRecommendationDate(
  relativeDate: RelativeRecommendationDate,
  now = new Date(),
) {
  const offsetDays = relativeDateOffsets[relativeDate];

  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: crimeaTimeZone,
    day: "numeric",
    month: "long",
  }).format(new Date(now.getTime() + offsetDays * dayMilliseconds));
}

export function parseRelativeRecommendationDate(
  value: FormDataEntryValue | null,
): RelativeRecommendationDate {
  if (
    value === "today" ||
    value === "tomorrow" ||
    value === "dayAfterTomorrow"
  ) {
    return value;
  }

  throw new Error("Выберите день поездки");
}
