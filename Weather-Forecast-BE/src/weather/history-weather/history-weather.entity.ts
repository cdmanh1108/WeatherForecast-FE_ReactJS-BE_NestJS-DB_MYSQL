// src/entities/history-weather.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { City } from 'src/city/city.entity';
import { WeatherCondition } from 'src/weather-condition/weather-condition.entity';

@Entity('HistoryWeather')
@Index(['city_id', 'timestamp'], { unique: true })
export class HistoryWeather {
  @PrimaryGeneratedColumn()
  declare history_weather_id: number;
  @Column()
  declare city_id: number;
  @Column()
  declare weather_condition_id: number;
  @Column('bigint')
  declare timestamp: number;
  @Column({ length: 5 })
  declare icon: string;
  @Column('float')
  declare temperature: number;
  @Column('float')
  declare temperature_min: number;
  @Column('float')
  declare temperature_max: number;
  @Column('int')
  declare pressure: number;
  @Column('int')
  declare humidity: number;
  @Column('float')
  declare wind_speed: number;
  @Column('int')
  declare wind_deg: number;
  @Column('int')
  declare clouds: number;
  @ManyToOne(() => City, (city) => city.historyWeathers)
  @JoinColumn({ name: 'city_id' })
  declare city: City;
  @ManyToOne(() => WeatherCondition, (wc) => wc.historyWeathers)
  @JoinColumn({ name: 'weather_condition_id' })
  declare weatherCondition: WeatherCondition;
}
