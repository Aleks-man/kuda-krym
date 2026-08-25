export function formatTravelDistance(distanceMeters: number) {
  if (distanceMeters < 1_000) return `${distanceMeters} м`;

  return `${new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 1,
  }).format(distanceMeters / 1_000)} км`;
}

export function formatTravelDuration(durationMinutes: number) {
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  if (hours === 0) return `${minutes} мин`;
  if (minutes === 0) return `${hours} ч`;
  return `${hours} ч ${minutes} мин`;
}
