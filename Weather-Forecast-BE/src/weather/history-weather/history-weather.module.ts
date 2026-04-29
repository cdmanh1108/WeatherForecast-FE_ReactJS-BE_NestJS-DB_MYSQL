import { Module } from '@nestjs/common';
import { HistoryWeatherService } from './history-weather.service';
import { HistoryWeatherController } from './history-weather.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryWeather } from './history-weather.entity';
import { ServicesModule } from 'src/services/services.module';
import { CityModule } from 'src/city/city.module';
import { City } from 'src/city/city.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([HistoryWeather, City]),
    ServicesModule,
    CityModule,
  ],
  providers: [HistoryWeatherService],
  controllers: [HistoryWeatherController],
  exports: [HistoryWeatherService],
})
export class HistoryWeatherModule {}
