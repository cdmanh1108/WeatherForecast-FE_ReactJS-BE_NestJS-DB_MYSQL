import { Controller, Get, Query } from '@nestjs/common';
import { HourlyForecastService } from './hourly-forecast.service';
import { ApiResponse } from 'src/common/dto/response/api-response.response';

@Controller('weather')
export class HourlyForecastController {
  constructor(private readonly hourlyForecastService: HourlyForecastService) {}

  @Get('forecast/hourly')
  async getHourlyForecastWeatherByCityId(
    @Query('city_id') city_id: number,
    @Query('page') page = 1,
    @Query('limit') limit = 12
  ) {
    const hourlyForcastWeathers =
      await this.hourlyForecastService.getHourlyForecastWeatherByCityId(
        city_id,
        +page,
        +limit
      );
    return ApiResponse.success(
      hourlyForcastWeathers,
      `Get hourly forecast weather successfully`
    );
  }
}
