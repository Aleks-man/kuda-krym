export const originOptions = [
  { value: "simferopol", label: "Симферополь" },
  { value: "sevastopol", label: "Севастополь" },
  { value: "yalta", label: "Ялта" },
  { value: "evpatoria", label: "Евпатория" },
  { value: "feodosia", label: "Феодосия" },
  { value: "kerch", label: "Керчь" },
  { value: "alushta", label: "Алушта" },
  { value: "sudak", label: "Судак" },
  { value: "saki", label: "Саки" },
  { value: "bakhchisaray", label: "Бахчисарай" },
  { value: "dzhankoy", label: "Джанкой" },
  { value: "belogorsk", label: "Белогорск" },
  { value: "krasnoperekopsk", label: "Красноперекопск" },
  { value: "armyansk", label: "Армянск" },
  { value: "chernomorskoe", label: "Черноморское" },
  { value: "shchelkino", label: "Щёлкино" },
] as const;

export const dateOptions = [
  { value: "today", label: "Сегодня" },
  { value: "tomorrow", label: "Завтра" },
  { value: "dayAfterTomorrow", label: "Послезавтра" },
] as const;

export const travelTimeOptions = [
  { value: "60", label: "До 1 часа" },
  { value: "90", label: "До 1,5 часов" },
  { value: "120", label: "До 2 часов" },
  { value: "180", label: "До 3 часов" },
] as const;

export const timeOptions = [
  { value: "morning", label: "Утро", detail: "08:00–13:00", endHour: 13 },
  { value: "day", label: "День", detail: "12:00–17:00", endHour: 17 },
  { value: "evening", label: "Вечер", detail: "15:00–20:00", endHour: 20 },
  { value: "all_day", label: "Весь день", detail: "08:00–20:00", endHour: 20 },
] as const;

export const priorityOptions = [
  { value: "calm_sea", label: "Спокойное море", icon: "≈" },
  { value: "warm_water", label: "Тёплая вода", icon: "°" },
  { value: "comfort", label: "Комфортная погода", icon: "☼" },
] as const;
