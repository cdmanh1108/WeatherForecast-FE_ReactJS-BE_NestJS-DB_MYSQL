import { CurrentWeather } from "./current-weather";
import { HourlyForecast } from "./hourly-forecast";
import { DailyForecast } from "./daily-forecast";
import { WeatherHistory } from "./weather-history";

export interface WeatherData {
  city: string;
  country: string;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  history: WeatherHistory[];
}
