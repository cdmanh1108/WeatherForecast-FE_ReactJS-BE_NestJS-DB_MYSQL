import { CurrentWeatherResponse } from 'src/weather/current-weather/dto/response/current-weather.response';
import { DailyForecastResponse } from 'src/weather/daily-forecast/dto/response/daily-forecast-weather.response';
import { HistoryWeatherResponse } from 'src/weather/history-weather/dto/response/history-weather.response';
import { HourlyForecastResponse } from 'src/weather/hourly-forecast/dto/response/hourly-forecast-weather.response';

export class WeatherFullResponse {
  city: string;
  country: string;
  current: CurrentWeatherResponse;
  hourly: HourlyForecastResponse[];
  daily: DailyForecastResponse[];
  history: HistoryWeatherResponse[];
}
