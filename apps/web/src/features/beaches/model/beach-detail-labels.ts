import type { BeachDetail } from "@kuda-krym/contracts";

const labels = {
  surface: {
    SAND: "Песок",
    PEBBLE: "Галька",
    MIXED: "Смешанное покрытие",
    ROCK: "Скалы",
  },
  waterEntry: {
    GENTLE: "Пологий",
    MODERATE: "Умеренный",
    STEEP: "Резкий",
  },
  childSuitability: {
    SUITABLE: "Подходит",
    LIMITED: "С ограничениями",
    UNSUITABLE: "Не подходит",
  },
  infrastructure: {
    NONE: "Нет",
    BASIC: "Базовая",
    DEVELOPED: "Развитая",
  },
  parking: {
    NONE: "Нет",
    REMOTE: "В отдалении",
    NEARBY: "Рядом",
    ON_SITE: "На территории",
  },
  accessibility: {
    LIMITED: "Ограниченная",
    ACCESSIBLE: "Доступная среда",
  },
  bayProtection: {
    OPEN: "Открытое побережье",
    PARTIAL: "Частично защищён",
    PROTECTED: "Защищённая бухта",
  },
  availability: { YES: "Есть", NO: "Нет" },
} as const;

export function getBeachDetailFacts(beach: BeachDetail) {
  const facts: Array<Readonly<{ label: string; value: string | undefined }>> = [
    { label: "Покрытие", value: getLabel(labels.surface, beach.surface) },
    {
      label: "Вход в воду",
      value: getLabel(labels.waterEntry, beach.profile.waterEntry),
    },
    {
      label: "Для детей",
      value: getLabel(
        labels.childSuitability,
        beach.profile.childSuitability,
      ),
    },
    {
      label: "Инфраструктура",
      value: getLabel(labels.infrastructure, beach.profile.infrastructure),
    },
    {
      label: "Парковка",
      value: getLabel(labels.parking, beach.profile.parking),
    },
    {
      label: "Доступность",
      value: getLabel(labels.accessibility, beach.profile.accessibility),
    },
    {
      label: "Положение",
      value: getLabel(labels.bayProtection, beach.profile.bayProtection),
    },
    {
      label: "Туалет",
      value: getLabel(labels.availability, beach.profile.hasToilet),
    },
    {
      label: "Душ",
      value: getLabel(labels.availability, beach.profile.hasShower),
    },
    {
      label: "Раздевалка",
      value: getLabel(labels.availability, beach.profile.hasChangingRoom),
    },
  ];

  return facts.filter(
    (fact): fact is Readonly<{ label: string; value: string }> =>
      fact.value !== undefined,
  );
}

function getLabel<T extends Record<string, string>>(
  values: T,
  value: string,
): string | undefined {
  return values[value as keyof T];
}
