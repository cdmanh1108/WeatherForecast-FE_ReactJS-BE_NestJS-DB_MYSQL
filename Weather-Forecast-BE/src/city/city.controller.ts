import {
  Controller,
  Get,
  Param,
  ParseFloatPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CityService } from './city.service';
import { ApiResponse } from 'src/common/dto/response/api-response.response';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get('suggest')
  async suggest(@Query('keyword') keyword: string) {
    const result = await this.cityService.suggestNameCities(keyword);
    return ApiResponse.success(result, 'Get city list suggestion successfully');
  }

  @Get('by-coordinates')
  async getCityByCoordinates(
    @Query('latitude', ParseFloatPipe) latitude: number,
    @Query('longitude', ParseFloatPipe) longitude: number
  ) {
    const result = await this.cityService.getCityByCoordinates(
      latitude,
      longitude
    );
    return ApiResponse.success(result, 'Get city by coordinates successfully');
  }

  @Get(':city_id')
  async getCityById(@Param('city_id', ParseIntPipe) city_id: number) {
    const result = await this.cityService.getCityDetailById(city_id);
    return ApiResponse.success(result, 'Get city by id successfully');
  }
}
