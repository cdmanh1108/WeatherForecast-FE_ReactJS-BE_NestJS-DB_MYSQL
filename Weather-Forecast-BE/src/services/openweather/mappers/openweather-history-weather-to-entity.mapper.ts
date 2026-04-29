// src/mappers/openweather-history-weather-to-entity.mapper.ts
import { OpenWeatherHistoryItem } from '../interfaces/history-weather.interface';
import { HistoryWeather } from 'src/weather/history-weather/history-weather.entity';

export function mapToHistoryWeatherEntity(
  item: OpenWeatherHistoryItem,
  cityId: number
): HistoryWeather {
  const entity = new HistoryWeather();
  entity.icon = item.weather[0].icon;
  entity.city_id = cityId;
  entity.weather_condition_id = item.weather[0].id;
  entity.timestamp = item.dt;
  entity.temperature = item.main.temp;
  entity.temperature_min = item.main.temp_min;
  entity.temperature_max = item.main.temp_max;
  entity.pressure = item.main.pressure;
  entity.humidity = item.main.humidity;
  entity.wind_speed = item.wind.speed;
  entity.wind_deg = item.wind.deg;
  entity.clouds = item.clouds.all;

  return entity;
}
