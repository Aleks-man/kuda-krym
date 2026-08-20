import type { BeachDetail } from "@kuda-krym/contracts";

const unknown = "Данные уточняются";

const labels = {
  surface: {
    UNKNOWN: unknown,
    SAND: "Песок",
    PEBBLE: "Галька",
    MIXED: "Смешанное покрытие",
    ROCK: "Скалы",
  },
  waterEntry: {
    UNKNOWN: unknown,
    GENTLE: "Пологий",
    MODERATE: "Умеренный",
    STEEP: "Резкий",
  },
  childSuitability: {
    UNKNOWN: unknown,
    SUITABLE: "Подходит",
    LIMITED: "С ограничениями",
    UNSUITABLE: "Не подходит",
  },
  infrastructure: {
    UNKNOWN: unknown,
    NONE: "Нет",
    BASIC: "Базовая",
    DEVELOPED: "Развитая",
  },
  parking: {
    UNKNOWN: unknown,
    NONE: "Нет",
    REMOTE: "В отдалении",
    NEARBY: "Рядом",
    ON_SITE: "На территории",
  },
  accessibility: {
    UNKNOWN: unknown,
    LIMITED: "Ограниченная",
    ACCESSIBLE: "Доступная среда",
  },
  bayProtection: {
    UNKNOWN: unknown,
    OPEN: "Открытое побережье",
    PARTIAL: "Частично защищён",
    PROTECTED: "Защищённая бухта",
  },
  availability: { UNKNOWN: unknown, YES: "Есть", NO: "Нет" },
} as const;

export function getBeachDetailFacts(beach: BeachDetail) {
  return [
    { label: "Покрытие", value: labels.surface[beach.surface] },
    { label: "Вход в воду", value: labels.waterEntry[beach.profile.waterEntry] },
    {
      label: "Для детей",
      value: labels.childSuitability[beach.profile.childSuitability],
    },
    {
      label: "Инфраструктура",
      value: labels.infrastructure[beach.profile.infrastructure],
    },
    { label: "Парковка", value: labels.parking[beach.profile.parking] },
    {
      label: "Доступность",
      value: labels.accessibility[beach.profile.accessibility],
    },
    {
      label: "Положение",
      value: labels.bayProtection[beach.profile.bayProtection],
    },
    { label: "Туалет", value: labels.availability[beach.profile.hasToilet] },
    { label: "Душ", value: labels.availability[beach.profile.hasShower] },
    {
      label: "Раздевалка",
      value: labels.availability[beach.profile.hasChangingRoom],
    },
  ];
}
