export const originOptions = [
  { value: "simferopol", label: "Симферополь" },
  { value: "sevastopol", label: "Севастополь" },
  { value: "yalta", label: "Ялта" },
  { value: "evpatoria", label: "Евпатория" },
  { value: "feodosia", label: "Феодосия" },
  { value: "kerch", label: "Керчь" },
] as const;

export const dateOptions = [
  { value: "today", label: "Сегодня" },
  { value: "tomorrow", label: "Завтра" },
] as const;

export const timeOptions = [
  { value: "morning", label: "Утро", detail: "09:00–13:00" },
  { value: "day", label: "День", detail: "12:00–17:00" },
  { value: "evening", label: "Вечер", detail: "15:00–19:00" },
] as const;

export const companyOptions = [
  { value: "alone", label: "Один или вдвоём" },
  { value: "children", label: "С детьми" },
  { value: "friends", label: "Компанией" },
] as const;

export const surfaceOptions = [
  { value: "any", label: "Неважно" },
  { value: "sand", label: "Песок" },
  { value: "pebble", label: "Галька" },
] as const;

export const priorityOptions = [
  { value: "calm_sea", label: "Спокойное море", icon: "≈" },
  { value: "warm_water", label: "Тёплая вода", icon: "°" },
  { value: "comfort", label: "Комфортная погода", icon: "☼" },
] as const;
