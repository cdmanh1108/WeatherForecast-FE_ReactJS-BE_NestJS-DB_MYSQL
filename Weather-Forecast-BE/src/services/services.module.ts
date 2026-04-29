import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OpenWeatherService } from './openweather/openweather.service';
import { OpenWeatherHistoryService } from './openweather/openweather-history.service';
import { CloudinaryProvider } from './cloudinary/cloudinary.provider';
import { CloudinaryService } from './cloudinary/cloudinary.service';

@Module({
  imports: [HttpModule],
  providers: [
    OpenWeatherService,
    OpenWeatherHistoryService,
    CloudinaryProvider,
    CloudinaryService,
  ],
  exports: [OpenWeatherService, OpenWeatherHistoryService, CloudinaryService],
})
export class ServicesModule {}
