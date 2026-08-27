import type { ForecastSourceFreshness } from "@kuda-krym/contracts";

import type { ForecastLocation } from "../../weather-forecast.js";
import type { WeatherModel } from "../model-weather-forecast.js";
import type { WeatherModelAgreement } from "../agreement/weather-model-agreement.types.js";
import type { WeatherModelSample } from "./weather-model-alignment.js";
import type { WeatherModelFailure } from "./weather-model-batch.js";

export type WeatherModelComparisonHour = Readonly<{
  time: string;
  samples: WeatherModelSample[];
  agreement: Omit<WeatherModelAgreement, "time">;
}>;

export type WeatherModelComparison = Readonly<{
  location: ForecastLocation;
  generatedAt: string;
  freshness: ForecastSourceFreshness | null;
  models: Readonly<{
    available: WeatherModel[];
    failures: WeatherModelFailure[];
  }>;
  hourly: WeatherModelComparisonHour[];
}>;
