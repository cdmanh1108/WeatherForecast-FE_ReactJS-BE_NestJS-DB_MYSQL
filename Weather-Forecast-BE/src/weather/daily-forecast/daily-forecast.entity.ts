import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { City } from 'src/city/city.entity';
import { WeatherCondition } from 'src/weather-condition/weather-condition.entity';

@Entity('DailyForecast')
export class DailyForecast {
  @PrimaryGeneratedColumn()
  declare daily_forecast_id: number;
  @Column()
  declare city_id: number;
  @Column()
  declare weather_condition_id: number;
  @Column('bigint')
  declare df_date: number;
  @Column({ length: 5 })
  declare icon: string;
  @Column('bigint')
  declare sunrise: number;
  @Column('bigint')
  declare sunset: number;
  @Column('bigint')
  declare moonrise: number;
  @Column('bigint')
  declare moonset: number;
  @Column({ type: 'varchar', length: 100, nullable: true })
  declare summary: string | null;
  @Column('float')
  declare temperature_max: number;
  @Column('float')
  declare temperature_min: number;
  @Column('float')
  declare temperature_morn: number;
  @Column('float')
  declare temperature_day: number;
  @Column('float')
  declare temperature_eve: number;
  @Column('float')
  declare temperature_night: number;
  @Column('float')
  declare feels_like_morn: number;
  @Column('float')
  declare feels_like_day: number;
  @Column('float')
  declare feels_like_eve: number;
  @Column('float')
  declare feels_like_night: number;
  @Column('int')
  declare pressure: number;
  @Column('int')
  declare humidity: number;
  @Column('float')
  declare wind_speed: number;
  @Column('int')
  declare clouds: number;
  @Column('float')
  declare uv: number;
  @Column('float')
  declare pop: number;
  @Column('int')
  declare aqi: number;
  @ManyToOne(() => City, (city) => city.dailyForecasts)
  @JoinColumn({ name: 'city_id' })
  declare city: City;
  @ManyToOne(() => WeatherCondition, (wc) => wc.dailyForecasts)
  @JoinColumn({ name: 'weather_condition_id' })
  declare weatherCondition: WeatherCondition;
}
