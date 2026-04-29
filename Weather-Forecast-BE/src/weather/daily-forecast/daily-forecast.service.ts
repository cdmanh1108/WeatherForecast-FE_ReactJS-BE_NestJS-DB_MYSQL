import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { DailyForecast } from './daily-forecast.entity';
import { OpenWeatherService } from 'src/services/openweather/openweather.service';
import { CityService } from 'src/city/city.service';
import { DailyForecastResponse } from './dto/response/daily-forecast-weather.response';
import { mapToDailyForecastResponse } from './mappers/daily-forecast-weather-to-response.mapper';
import { OpenWeatherDailyForecastResponse } from 'src/services/openweather/interfaces/daily-forecast-weather.interface';
import { mapToDailyForecastEntity } from 'src/services/openweather/mappers/openweather-daily-forecast-weather-to-entity.mapper';

@Injectable()
export class DailyForecastService {
  constructor(
    @InjectRepository(DailyForecast)
    private dailyForecastRepo: Repository<DailyForecast>,
    private openWeatherService: OpenWeatherService,
    private cityService: CityService
  ) {}

  async getDailyForecastWeatherByCityId(
    city_id: number
  ): Promise<DailyForecastResponse[]> {
    const city = await this.cityService.getCityById(city_id);
    if (!city) throw new NotFoundException('City not found');

    const now = Math.floor(Date.now() / 1000);
    const todayMidnight = now - (now % 86400); // bỏ phần giờ => mốc 0h hôm nay

    let rows = await this.dailyForecastRepo.find({
      where: {
        city: { city_id },
        df_date: MoreThan(todayMidnight),
      },
      relations: ['weatherCondition'],
      order: { df_date: 'ASC' },
    });

    if (rows.length === 0) {
      const { data: api } =
        await this.openWeatherService.call<OpenWeatherDailyForecastResponse>(
          '/forecast/daily',
          {
            lat: city.latitude,
            lon: city.longitude,
            units: 'metric',
          }
        );

      const entities = api.list.map((item) =>
        mapToDailyForecastEntity(item, city_id)
      );

      await this.dailyForecastRepo
        .createQueryBuilder()
        .insert()
        .values(entities)
        .orIgnore()
        .execute();

      rows = await this.dailyForecastRepo.find({
        where: {
          city: { city_id },
          df_date: MoreThan(todayMidnight),
        },
        relations: ['weatherCondition'],
        order: { df_date: 'ASC' },
      });
    }

    return rows.map(mapToDailyForecastResponse);
  }
}
