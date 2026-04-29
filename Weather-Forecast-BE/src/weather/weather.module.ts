import { Module } from '@nestjs/common';
import { CurrentWeatherModule } from './current-weather/current-weather.module';
import { HourlyForecastModule } from './hourly-forecast/hourly-forecast.module';
import { DailyForecastModule } from './daily-forecast/daily-forecast.module';
import { HistoryWeatherModule } from './history-weather/history-weather.module';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { CityModule } from 'src/city/city.module';

@Module({
  imports: [
    CityModule,
    CurrentWeatherModule,
    HourlyForecastModule,
    DailyForecastModule,
    HistoryWeatherModule,
  ],
  providers: [WeatherService],
  controllers: [WeatherController],
  exports: [
    WeatherService,
    CurrentWeatherModule,
    HourlyForecastModule,
    DailyForecastModule,
    HistoryWeatherModule,
  ],
})
export class WeatherModule {}
