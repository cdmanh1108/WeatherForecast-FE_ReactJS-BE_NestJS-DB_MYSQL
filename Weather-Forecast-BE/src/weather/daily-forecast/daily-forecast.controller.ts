import { Controller, Get, Query } from '@nestjs/common';
import { DailyForecastService } from './daily-forecast.service';
import { ApiResponse } from 'src/common/dto/response/api-response.response';

@Controller('weather')
export class DailyForecastController {
  constructor(private readonly dailyForecastService: DailyForecastService) {}

  @Get('forecast/daily')
  async getDailyForecastWeatherByCityId(@Query('city_id') city_id: number) {
    const dailyForcastWeathers =
      await this.dailyForecastService.getDailyForecastWeatherByCityId(city_id);
    return ApiResponse.success(
      dailyForcastWeathers,
      `Get daily forecast weather successfully`
    );
  }
}
