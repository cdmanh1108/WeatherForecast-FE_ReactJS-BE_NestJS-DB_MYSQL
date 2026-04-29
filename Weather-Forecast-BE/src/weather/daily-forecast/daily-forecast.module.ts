import { Module } from '@nestjs/common';
import { DailyForecastService } from './daily-forecast.service';
import { DailyForecastController } from './daily-forecast.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyForecast } from './daily-forecast.entity';
import { ServicesModule } from 'src/services/services.module';
import { CityModule } from 'src/city/city.module';
import { City } from 'src/city/city.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DailyForecast, City]),
    ServicesModule,
    CityModule,
  ],
  providers: [DailyForecastService],
  controllers: [DailyForecastController],
  exports: [DailyForecastService],
})
export class DailyForecastModule {}
