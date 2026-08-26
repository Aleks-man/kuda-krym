export type WeatherAgreementLevel =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "INSUFFICIENT_DATA";

export type WeatherAgreementFactorName =
  | "TEMPERATURE"
  | "PRECIPITATION"
  | "WIND_SPEED"
  | "WIND_DIRECTION"
  | "WIND_GUST"
  | "CLOUD_COVER";

export type WeatherAgreementUnit =
  | "CELSIUS"
  | "MILLIMETERS"
  | "MPS"
  | "DEGREES"
  | "PERCENT";

export type WeatherAgreementFactor = Readonly<{
  name: WeatherAgreementFactorName;
  spread: number;
  unit: WeatherAgreementUnit;
  score: number;
  weight: number;
}>;

export type WeatherModelAgreement = Readonly<{
  time: string;
  modelCount: number;
  score: number | null;
  level: WeatherAgreementLevel;
  factors: WeatherAgreementFactor[];
}>;
