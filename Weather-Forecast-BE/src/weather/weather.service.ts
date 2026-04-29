import { Injectable } from '@nestjs/common';
import { CityService } from 'src/city/city.service';
import { CurrentWeatherService } from './current-weather/current-weather.service';
import { DailyForecastService } from './daily-forecast/daily-forecast.service';
import { HistoryWeatherService } from './history-weather/history-weather.service';
import { HourlyForecastService } from './hourly-forecast/hourly-forecast.service';
import { WeatherFullResponse } from './dto/response/weather-full.response';

@Injectable()
export class WeatherService {
  constructor(
    private readonly cityService: CityService,
    private readonly currentWeatherService: CurrentWeatherService,
    private readonly hourlyForecastService: HourlyForecastService,
    private readonly dailyForecastService: DailyForecastService,
    private readonly historyWeatherService: HistoryWeatherService
  ) {}

  async getWeatherFullByCityId(city_id: number): Promise<WeatherFullResponse> {
    const city = await this.cityService.getCityByIdWithCountry(city_id);

    const [current, hourly, daily, history] = await Promise.all([
      this.currentWeatherService.getCurrentWeatherByCityId(city_id),
      this.hourlyForecastService.getHourlyForecastWeatherByCityId(
        city_id,
        1,
        24
      ),
      this.dailyForecastService.getDailyForecastWeatherByCityId(city_id),
      this.historyWeatherService.getHistoryWeatherByCityId(city_id),
    ]);

    return {
      city: city.city_name,
      country: city.country?.country_name || '',
      current,
      hourly: hourly.data,
      daily,
      history,
    };
  }
}
