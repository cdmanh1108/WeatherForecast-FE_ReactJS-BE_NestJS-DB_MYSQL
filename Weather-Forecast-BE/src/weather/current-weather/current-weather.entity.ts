import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { City } from 'src/city/city.entity';
import { WeatherCondition } from 'src/weather-condition/weather-condition.entity';

@Entity('CurrentWeather')
export class CurrentWeather {
  @PrimaryGeneratedColumn()
  declare current_weather_id: number;

  @Column()
  declare city_id: number;

  @Column()
  declare weather_condition_id: number;

  @Column('bigint')
  declare cur_timestamp: number;

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

  @Column('int')
  declare aqi: number;

  @OneToOne(() => City, (city) => city.currentWeather)
  @JoinColumn({ name: 'city_id' })
  declare city: City;

  @ManyToOne(() => WeatherCondition, (wc) => wc.currentWeathers)
  @JoinColumn({ name: 'weather_condition_id' })
  declare weatherCondition: WeatherCondition;
}
