import { WeatherCondition } from "./weather-condition";

export interface CurrentWeather {
  temp: number;
  feelsLike: number;
  pressure: number;
  humidity: number;
  cloudCoverage: number;
  visibility: number;
  windSpeed: number;
  uvIndex: number;
  aqi: number;
  condition: WeatherCondition;
  lastUpdated: string;
}
