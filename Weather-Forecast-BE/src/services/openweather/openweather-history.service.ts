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
export class OpenWeatherHistoryService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(openweatherConfig.KEY)
    private readonly config: ConfigType<typeof openweatherConfig>
  ) {}

  async call<T = any>(
    endpoint: string,
    params: Record<string, any> = {}
  ): Promise<AxiosResponse<T>> {
    const url = `https://history.openweathermap.org/data/2.5${endpoint}`;
    params.appid = this.config.apiKey;

    try {
      return await this.httpService.axiosRef.get<T>(url, { params });
    } catch (error: unknown) {
      console.error(
        'OpenWeather History API error:',
        this.getErrorDetail(error)
      );
      throw new InternalServerErrorException(
        'Failed to fetch data from OpenWeather History API'
      );
    }
  }

  private getErrorDetail(error: unknown): unknown {
    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === 'object' && error !== null && 'response' in error) {
      const response = (error as { response?: { data?: unknown } | null })
        .response;
      if (response && 'data' in response) {
        return response.data;
      }
    }

    return error;
  }
}
