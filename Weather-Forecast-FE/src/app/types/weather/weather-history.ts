import { WeatherCondition } from "./weather-condition";

export interface WeatherHistory {
  date: string;
  temp: number;
  minTemp: number;
  maxTemp: number;
  pressure: number;
  humidity: number;
  windSpeed: number;
  windDeg: number;
  cloudCoverage: number;
  condition: WeatherCondition;
}
