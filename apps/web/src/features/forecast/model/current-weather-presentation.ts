import type { CurrentWeather, ForecastHour } from "@kuda-krym/contracts";

export function selectCurrentForecastHour(hours: ForecastHour[], now = new Date()) {
  const hourStart = Math.floor(now.getTime() / 3_600_000) * 3_600_000;
  return hours.find(hour => Date.parse(hour.time + "Z") === hourStart) ?? hours[0]!;
}

type Weather = Pick<CurrentWeather, "cloudCoverPercent" | "precipitationMillimeters"> & Partial<Pick<CurrentWeather, "weatherCode">>;

export function getCurrentWeatherPresentation(weather: Weather, isNight: boolean) {
  const code = weather.weatherCode;
  if (code === 95 || code === 96 || code === 99) return { variant: "thunder", label: code === 95 ? "Гроза" : "Гроза с градом" };
  if ([71, 73, 75, 77, 85, 86].includes(code ?? -1)) return { variant: "snow", label: code === 75 || code === 86 ? "Сильный снег" : "Снег" };
  if (code === 56 || code === 57 || code === 66 || code === 67) return { variant: "rain", label: "Ледяные осадки" };
  if (code === 65 || code === 82) return { variant: "heavy-rain", label: code === 82 ? "Сильный ливень" : "Сильный дождь" };
  if (code === 80 || code === 81) return { variant: "rain", label: "Ливневый дождь" };
  if (code === 61 || code === 63) return { variant: "rain", label: code === 61 ? "Небольшой дождь" : "Дождь" };
  if (code === 51 || code === 53 || code === 55) return { variant: "rain", label: "Морось" };
  // An accumulated amount is not a probability and does not establish rainfall intensity.
  if (weather.precipitationMillimeters > 0) return { variant: "rain", label: "Осадки" };
  if (code === 45 || code === 48) return { variant: "fog", label: "Туман" };
  const cloud = code === 0 || code === 1 ? 0 : code === 2 ? 50 : code === 3 ? 100 : weather.cloudCoverPercent;
  if (cloud < 30) return { variant: isNight ? "clear-night" : "clear", label: code === 1 ? "Преимущественно ясно" : "Ясно" };
  if (cloud < 70) return { variant: isNight ? "partly-cloudy-night" : "partly-cloudy", label: "Переменная облачность" };
  return { variant: isNight ? "cloudy-night" : "cloudy", label: "Облачно" };
}
