import type { WeatherModel } from "../model-weather-forecast.js";

type OpenMeteoModelConfig = Readonly<{
  baseUrl: string;
  attribution: string;
}>;

export const openMeteoModelConfig: Record<
  WeatherModel,
  OpenMeteoModelConfig
> = {
  ECMWF_IFS: {
    baseUrl: "https://api.open-meteo.com/v1/ecmwf",
    attribution: "ECMWF IFS via Open-Meteo",
  },
  DWD_ICON: {
    baseUrl: "https://api.open-meteo.com/v1/dwd-icon",
    attribution: "DWD ICON via Open-Meteo",
  },
  NOAA_GFS: {
    baseUrl: "https://api.open-meteo.com/v1/gfs",
    attribution: "NOAA GFS via Open-Meteo",
  },
};
