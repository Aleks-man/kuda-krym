export type RelativeRecommendationDate =
  | "today"
  | "tomorrow"
  | "dayAfterTomorrow"
  | "day3"
  | "day4"
  | "day5"
  | "day6";

const crimeaTimeZone = "Europe/Moscow";
const dayMilliseconds = 86_400_000;

const relativeDateOffsets: Record<RelativeRecommendationDate, number> = {
  today: 0,
  tomorrow: 1,
  dayAfterTomorrow: 2,
  day3: 3,
  day4: 4,
  day5: 5,
  day6: 6,
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

  const date = new Date(now.getTime() + offsetDays * dayMilliseconds);
  const weekday = new Intl.DateTimeFormat("ru-RU", { timeZone: crimeaTimeZone, weekday: "long" }).format(date);
  const label = new Intl.DateTimeFormat("ru-RU", {
    timeZone: crimeaTimeZone,
    day: "numeric",
    month: "long",
  }).format(date);
  return `${label} (${weekday})`;
}

export function parseRelativeRecommendationDate(
  value: FormDataEntryValue | null,
): RelativeRecommendationDate {
  if (
    value === "today" ||
    value === "tomorrow" ||
    value === "dayAfterTomorrow" ||
    value === "day3" ||
    value === "day4" ||
    value === "day5" ||
    value === "day6"
  ) {
    return value;
  }

  throw new Error("Выберите день поездки");
}

export function getRecommendationDateOptions(now = new Date()) {
  return (Object.keys(relativeDateOffsets) as RelativeRecommendationDate[]).map((value) => ({
    value,
    label: `${value === "today" ? "Сегодня, " : value === "tomorrow" ? "Завтра, " : ""}${formatRecommendationDate(value, now)}`,
  }));
}
