import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { HistoryWeather } from './history-weather.entity';
import { OpenWeatherHistoryService } from 'src/services/openweather/openweather-history.service';
import { CityService } from 'src/city/city.service';
import { HistoryWeatherResponse } from './dto/response/history-weather.response';
import { OpenWeatherHistoryResponse } from 'src/services/openweather/interfaces/history-weather.interface';
import { mapToHistoryWeatherEntity } from 'src/services/openweather/mappers/openweather-history-weather-to-entity.mapper';
import { mapToHistoryWeatherResponse } from './mappers/history-weather-to-response.mapper';

@Injectable()
export class HistoryWeatherService {
  constructor(
    @InjectRepository(HistoryWeather)
    private historyWeatherRepo: Repository<HistoryWeather>,
    private openWeatherHistoryService: OpenWeatherHistoryService,
    private cityService: CityService
  ) {}

  async getHistoryWeatherByCityId(
    city_id: number
  ): Promise<HistoryWeatherResponse[]> {
    const city = await this.cityService.getCityById(city_id);
    if (!city) throw new NotFoundException('City not found');

    const now = Math.floor(Date.now() / 1000);
    const oneDayAgo = now - 86400;

    let rows = await this.historyWeatherRepo.find({
      where: {
        city: { city_id },
        timestamp: MoreThan(oneDayAgo),
      },
      order: { timestamp: 'ASC' },
      relations: ['weatherCondition'],
    });

    if (rows.length === 0) {
      const { data: api } =
        await this.openWeatherHistoryService.call<OpenWeatherHistoryResponse>(
          '/history/city',
          {
            lat: city.latitude,
            lon: city.longitude,
            type: 'day',
            units: 'metric',
          }
        );
      const entities = api.list.map((item) =>
        mapToHistoryWeatherEntity(item, city_id)
      );

      await this.historyWeatherRepo
        .createQueryBuilder()
        .insert()
        .values(entities)
        .orIgnore()
        .execute();

      rows = await this.historyWeatherRepo.find({
        where: {
          city: { city_id },
          timestamp: MoreThan(oneDayAgo),
        },
        relations: ['weatherCondition'],
        order: { timestamp: 'ASC' },
      });
    }

    return rows.map(mapToHistoryWeatherResponse);
  }
}
