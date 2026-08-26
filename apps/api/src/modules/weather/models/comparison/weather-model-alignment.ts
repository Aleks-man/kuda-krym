import type {
  HourlyModelWeather,
  WeatherModel,
} from "../model-weather-forecast.js";

export type WeatherModelSample = Readonly<{
  model: WeatherModel;
  generatedAt: string;
  conditions: Omit<HourlyModelWeather, "time">;
}>;

export type AlignedWeatherModelHour = Readonly<{
  time: string;
  samples: WeatherModelSample[];
}>;
