import { Module } from '@nestjs/common';
import { HourlyForecastService } from './hourly-forecast.service';
import { HourlyForecastController } from './hourly-forecast.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HourlyForecast } from './hourly-forecast.entity';
import { ServicesModule } from 'src/services/services.module';
import { CityModule } from 'src/city/city.module';
import { City } from 'src/city/city.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([HourlyForecast, City]),
    ServicesModule,
    CityModule,
  ],
  providers: [HourlyForecastService],
  controllers: [HourlyForecastController],
  exports: [HourlyForecastService],
})
export class HourlyForecastModule {}
