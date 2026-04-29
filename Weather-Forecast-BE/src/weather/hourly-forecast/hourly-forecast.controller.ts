import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { HourlyForecastService } from './hourly-forecast.service';
import { ApiResponse } from 'src/common/dto/response/api-response.response';

@Controller('weather')
export class HourlyForecastController {
  constructor(private readonly hourlyForecastService: HourlyForecastService) {}

  @Get('forecast/hourly')
  async getHourlyForecastWeatherByCityId(
    @Query('city_id', ParseIntPipe) city_id: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number
  ) {
    const hourlyForcastWeathers =
      await this.hourlyForecastService.getHourlyForecastWeatherByCityId(
        city_id,
        page,
        limit
      );
    return ApiResponse.success(
      hourlyForcastWeathers,
      `Get hourly forecast weather successfully`
    );
  }
}
