export function isCrimeaDaylight(time: string) {
  const local = new Date(new Date(`${time}Z`).getTime() + 3 * 60 * 60 * 1000);
  const startOfYear = Date.UTC(local.getUTCFullYear(), 0, 0);
  const currentDate = Date.UTC(
    local.getUTCFullYear(),
    local.getUTCMonth(),
    local.getUTCDate(),
  );
  const dayOfYear = Math.floor((currentDate - startOfYear) / 86_400_000);
  const declination = 23.44 * Math.sin(
    ((360 / 365) * (dayOfYear - 81) * Math.PI) / 180,
  );
  const hourAngle = Math.acos(
    -Math.tan(45 * Math.PI / 180) * Math.tan(declination * Math.PI / 180),
  );
  const daylightHours = (2 * hourAngle * 180 / Math.PI) / 15;
  const solarNoon = 12 + 3 - 34 / 15;
  const localHour = local.getUTCHours() + local.getUTCMinutes() / 60;

  return localHour >= solarNoon - daylightHours / 2
    && localHour < solarNoon + daylightHours / 2;
}
