import type {
  ModelWeatherForecast,
  WeatherModel,
} from "../model-weather-forecast.js";

export const comparisonWeatherModels = [
  "ECMWF_IFS",
  "DWD_ICON",
  "NOAA_GFS",
] as const satisfies readonly WeatherModel[];

export type WeatherModelFailure = Readonly<{
  model: WeatherModel;
  code: "MODEL_UNAVAILABLE";
}>;

export type WeatherModelBatch = Readonly<{
  available: ModelWeatherForecast[];
  failures: WeatherModelFailure[];
}>;
