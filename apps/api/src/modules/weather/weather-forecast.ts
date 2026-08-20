export type ForecastLocation = Readonly<{
  latitude: number;
  longitude: number;
}>;

export type WeatherForecastRequest = Readonly<{
  location: ForecastLocation;
  days: 1 | 2;
}>;

export type HourlyWeather = Readonly<{
  time: string;
  temperatureCelsius: number;
  precipitationProbabilityPercent: number;
  precipitationMillimeters: number;
  windSpeedMetersPerSecond: number;
  windDirectionDegrees: number;
  windGustMetersPerSecond: number;
  cloudCoverPercent: number;
}>;

export type WeatherForecast = Readonly<{
  location: ForecastLocation;
  timezone: "UTC";
  generatedAt: string;
  hourly: HourlyWeather[];
}>;

export interface WeatherForecastProvider {
  getForecast(request: WeatherForecastRequest): Promise<WeatherForecast>;
}
