import { WeatherCondition } from "./weather-condition";

export interface HourlyForecast {
  time: string;
  temp: number;
  feelsLike: number;
  pressure: number;
  humidity: number;
  cloudCoverage: number;
  visibility: number;
  windSpeed: number;
  uvIndex: number;
  aqi: number;
  pop: number;
  condition: WeatherCondition;
}
