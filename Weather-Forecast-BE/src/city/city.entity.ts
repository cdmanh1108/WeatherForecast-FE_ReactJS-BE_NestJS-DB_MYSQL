import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Column,
  OneToOne,
} from 'typeorm';
import { Country } from 'src/country/country.entity';
import { CurrentWeather } from 'src/weather/current-weather/current-weather.entity';
import { DailyForecast } from 'src/weather/daily-forecast/daily-forecast.entity';
import { HourlyForecast } from 'src/weather/hourly-forecast/hourly-forecast.entity';
import { HistoryWeather } from 'src/weather/history-weather/history-weather.entity';

@Entity('City')
export class City {
  @PrimaryColumn()
  declare city_id: number;
  @Column({ length: 50 })
  declare city_name: string;
  @Column({ length: 3 })
  declare country_id: string;
  @Column('float')
  declare latitude: number;
  @Column('float')
  declare longitude: number;
  @ManyToOne(() => Country, (country) => country.cities, { nullable: false })
  @JoinColumn({ name: 'country_id' })
  declare country: Country;
  @OneToOne(() => CurrentWeather, (cw) => cw.city)
  declare currentWeather: CurrentWeather | null;
  @OneToMany(() => DailyForecast, (df) => df.city)
  declare dailyForecasts: DailyForecast[];
  @OneToMany(() => HourlyForecast, (hf) => hf.city)
  declare hourlyForecasts: HourlyForecast[];
  @OneToMany(() => HistoryWeather, (hw) => hw.city)
  declare historyWeathers: HistoryWeather[];
}
