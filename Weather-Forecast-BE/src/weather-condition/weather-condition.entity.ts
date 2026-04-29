import { Column, Entity, PrimaryColumn, OneToMany } from 'typeorm';
import { CurrentWeather } from 'src/weather/current-weather/current-weather.entity';
import { DailyForecast } from 'src/weather/daily-forecast/daily-forecast.entity';
import { HourlyForecast } from 'src/weather/hourly-forecast/hourly-forecast.entity';
import { HistoryWeather } from 'src/weather/history-weather/history-weather.entity';

@Entity('WeatherCondition')
export class WeatherCondition {
  @PrimaryColumn()
  declare weather_condition_id: number;
  @Column({ length: 50 })
  declare main: string;
  @Column({ length: 100 })
  declare weather_description: string;
  @OneToMany(() => CurrentWeather, (cw) => cw.weatherCondition)
  declare currentWeathers: CurrentWeather[];
  @OneToMany(() => DailyForecast, (df) => df.weatherCondition)
  declare dailyForecasts: DailyForecast[];
  @OneToMany(() => HourlyForecast, (hf) => hf.weatherCondition)
  declare hourlyForecasts: HourlyForecast[];
  @OneToMany(() => HistoryWeather, (hw) => hw.weatherCondition)
  declare historyWeathers: HistoryWeather[];
}
