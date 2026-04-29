import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { HistoryWeatherService } from './history-weather.service';
import { ApiResponse } from 'src/common/dto/response/api-response.response';

@Controller('weather')
export class HistoryWeatherController {
  constructor(private readonly historyWeatherService: HistoryWeatherService) {}

  @Get('history')
  async getHistoryWeatherByCityId(
    @Query('city_id', ParseIntPipe) city_id: number
  ) {
    const historyWeathers =
      await this.historyWeatherService.getHistoryWeatherByCityId(city_id);
    return ApiResponse.success(
      historyWeathers,
      `Get history weather successfully`
    );
  }
}
