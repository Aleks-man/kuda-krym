// UV exposure categories: https://www.epa.gov/sites/default/files/documents/uviguide.pdf
export function getUvRisk(value: number | null | undefined) {
  if (value == null) return null;
  if (value >= 11) return "Экстремальный";
  if (value >= 8) return "Очень высокий";
  if (value >= 6) return "Высокий";
  if (value >= 3) return "Умеренный";
  return "Низкий";
}

export function formatVisibility(meters: number | null | undefined): string {
  if (meters == null) return "—";
  if (meters < 1000) return `${Math.round(meters)} м`;
  return `${Number((meters / 1000).toFixed(1)).toLocaleString("ru-RU")} км`;
}

export function formatPressure(hpa: number | null | undefined): string {
  return hpa == null ? "—" : `${Math.round(hpa * 0.750061683)} мм рт. ст.`;
}
