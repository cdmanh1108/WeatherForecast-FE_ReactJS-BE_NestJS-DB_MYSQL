import { WeatherCondition } from "./weather-condition";

export interface DailyForecast {
  date: string;
  maxTemp: number;
  minTemp: number;
  morningTemp: number;
  dayTemp: number;
  eveningTemp: number;
  nightTemp: number;
  feelsLikeDay: number;
  pressure: number;
  humidity: number;
  windSpeed: number;
  cloudCoverage: number;
  uvIndex: number;
  aqi: number;
  pop: number;
  summary: string;
  condition: WeatherCondition;
}
