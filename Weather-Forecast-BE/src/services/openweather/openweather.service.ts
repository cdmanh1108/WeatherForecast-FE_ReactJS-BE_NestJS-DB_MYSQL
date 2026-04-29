import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigType } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import openweatherConfig from 'src/config/openweather.config';

@Injectable()
export class OpenWeatherService {
  private readonly weatherBaseUrl =
    'https://api.openweathermap.org/data/2.5';
  private readonly geocodingBaseUrl = 'https://api.openweathermap.org/geo/1.0';

  constructor(
    private readonly httpService: HttpService,
    @Inject(openweatherConfig.KEY)
    private readonly config: ConfigType<typeof openweatherConfig>
  ) {}

  async call<T = any>(
    endpoint: string,
    params: Record<string, any> = {}
  ): Promise<AxiosResponse<T>> {
    const url = `${this.weatherBaseUrl}${endpoint}`;
    params.appid = this.config.apiKey;
    // console.log('Calling OpenWeather API:', url, 'with params:', params);

    try {
      return await this.httpService.axiosRef.get<T>(url, { params });
    } catch (error) {
      console.error(
        'OpenWeather API error:',
        error?.response?.data || error.message || error
      );
      throw new InternalServerErrorException(
        'Failed to fetch data from OpenWeather API'
      );
    }
  }

  async callGeocoding<T = any>(
    endpoint: string,
    params: Record<string, any> = {}
  ): Promise<AxiosResponse<T>> {
    const url = `${this.geocodingBaseUrl}${endpoint}`;
    params.appid = this.config.apiKey;

    try {
      return await this.httpService.axiosRef.get<T>(url, { params });
    } catch (error) {
      console.error(
        'OpenWeather Geocoding API error:',
        error?.response?.data || error.message || error
      );
      throw new InternalServerErrorException(
        'Failed to fetch data from OpenWeather Geocoding API'
      );
    }
  }

  async reverseGeocode(
    latitude: number,
    longitude: number,
    limit = 1
  ): Promise<
    Array<{
      name: string;
      lat: number;
      lon: number;
      country: string;
      state?: string;
    }>
  > {
    const response = await this.callGeocoding<
      Array<{
        name: string;
        lat: number;
        lon: number;
        country: string;
        state?: string;
      }>
    >('/reverse', {
      lat: latitude,
      lon: longitude,
      limit,
    });

    return response.data;
  }
}
