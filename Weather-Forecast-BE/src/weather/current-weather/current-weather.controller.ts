import { Controller, Get, Query } from '@nestjs/common';
import { ApiResponse } from 'src/common/dto/response/api-response.response';
import { CurrentWeatherService } from './current-weather.service';

@Controller('weather')
export class CurrentWeatherController {
  constructor(private readonly currentWeatherService: CurrentWeatherService) {}

  @Get()
  async getCurrentWeatherByCityId(@Query('city_id') city_id: number) {
    const weather =
      await this.currentWeatherService.getCurrentWeatherByCityId(city_id);
    return ApiResponse.success(weather, `Get current weather successfully`);
  }
}
