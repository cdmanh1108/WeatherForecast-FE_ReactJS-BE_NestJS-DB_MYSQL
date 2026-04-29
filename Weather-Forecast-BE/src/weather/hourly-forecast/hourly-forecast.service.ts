import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { HourlyForecast } from './hourly-forecast.entity';
import { OpenWeatherService } from 'src/services/openweather/openweather.service';
import { CityService } from 'src/city/city.service';
import { mapToHourlyForecastEntity } from 'src/services/openweather/mappers/openweather-hourly-forecast-weather-to-entity.mapper';
import { OpenWeatherHourlyForecastResponse } from 'src/services/openweather/interfaces/hourly-forecast-weather.interface';
import { mapToHourlyForecastWeatherResponse } from './mappers/hourly-forecast-weather-to-response.mapper';
import { HourlyForecastResponse } from './dto/response/hourly-forecast-weather.response';

@Injectable()
export class HourlyForecastService {
  constructor(
    @InjectRepository(HourlyForecast)
    private hourlyForecastWeatherRepo: Repository<HourlyForecast>,
    private openWeatherService: OpenWeatherService,
    private cityService: CityService
  ) {}

  async getHourlyForecastWeatherByCityId(
    city_id: number,
    page = 1,
    limit = 6
  ): Promise<{
    data: HourlyForecastResponse[];
    total: number;
    page: number;
    limit: number;
  }> {
    const city = await this.cityService.getCityById(city_id);
    if (!city) throw new NotFoundException('City not found');

    const now = Math.floor(Date.now() / 1000);

    let [rows, total] = await this.hourlyForecastWeatherRepo.findAndCount({
      where: {
        city: { city_id },
        hf_timestamp: MoreThan(now),
      },
      relations: ['weatherCondition'],
      order: { hf_timestamp: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    if (rows.length === 0) {
      const { data: api } =
        await this.openWeatherService.call<OpenWeatherHourlyForecastResponse>(
          '/forecast/hourly',
          { lat: city.latitude, lon: city.longitude, units: 'metric' }
        );

      const entities = api.list.map((item) =>
        mapToHourlyForecastEntity(item, city_id)
      );

      await this.hourlyForecastWeatherRepo
        .createQueryBuilder()
        .insert()
        .values(entities)
        .orIgnore()
        .execute();

      [rows, total] = await this.hourlyForecastWeatherRepo.findAndCount({
        where: {
          city: { city_id },
          hf_timestamp: MoreThan(now),
        },
        relations: ['weatherCondition'],
        order: { hf_timestamp: 'ASC' },
        skip: (page - 1) * limit,
        take: limit,
      });
    }

    return {
      data: rows.map(mapToHourlyForecastWeatherResponse),
      total,
      page,
      limit,
    };
  }
}
