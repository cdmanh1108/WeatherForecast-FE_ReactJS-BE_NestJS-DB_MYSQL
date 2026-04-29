import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { City } from 'src/city/city.entity';
import { WeatherCondition } from 'src/weather-condition/weather-condition.entity';

@Entity('HourlyForecast')
@Index(['city_id', 'hf_timestamp'], { unique: true })
export class HourlyForecast {
  @PrimaryGeneratedColumn()
  declare hourly_forecast_id: number;
  @Column()
  declare city_id: number;
  @Column()
  declare weather_condition_id: number;
  @Column('bigint')
  declare hf_timestamp: number;
  @Column({ length: 5 })
  declare icon: string;
  @Column('float')
  declare temperature: number;
  @Column('float')
  declare feels_like: number;
  @Column('int')
  declare pressure: number;
  @Column('int')
  declare humidity: number;
  @Column('int')
  declare clouds: number;
  @Column('float')
  declare uv: number;
  @Column('int')
  declare visibility: number;
  @Column('float')
  declare wind_speed: number;
  @Column('float')
  declare pop: number;
  @Column('int')
  declare aqi: number;
  @ManyToOne(() => City, (city) => city.hourlyForecasts)
  @JoinColumn({ name: 'city_id' })
  declare city: City;
  @ManyToOne(() => WeatherCondition, (wc) => wc.hourlyForecasts)
  @JoinColumn({ name: 'weather_condition_id' })
  declare weatherCondition: WeatherCondition;
}
