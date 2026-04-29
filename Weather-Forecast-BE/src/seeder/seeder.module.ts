import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from 'src/city/city.entity';
import { Country } from 'src/country/country.entity';
import { WeatherCondition } from 'src/weather-condition/weather-condition.entity';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([City, Country, WeatherCondition, User])],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
