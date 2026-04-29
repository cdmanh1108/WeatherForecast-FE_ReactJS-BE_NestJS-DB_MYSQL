import { Module } from '@nestjs/common';
import { CurrentWeatherService } from './current-weather.service';
import { CurrentWeatherController } from './current-weather.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesModule } from 'src/services/services.module';
import { CityModule } from 'src/city/city.module';
import { City } from 'src/city/city.entity';
import { CurrentWeather } from './current-weather.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CurrentWeather,
      City,
    ]),
    ServicesModule,
    CityModule,
  ],
  providers: [CurrentWeatherService],
  controllers: [CurrentWeatherController],
  exports: [CurrentWeatherService],
})
export class CurrentWeatherModule {}
