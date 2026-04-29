import { Controller, Get, Query } from '@nestjs/common';
import { ApiResponse } from 'src/common/dto/response/api-response.response';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('full')
  async getWeatherFullByCityId(@Query('city_id') city_id: number) {
    const weather = await this.weatherService.getWeatherFullByCityId(+city_id);
    return ApiResponse.success(weather, 'Get full weather successfully');
  }
}
