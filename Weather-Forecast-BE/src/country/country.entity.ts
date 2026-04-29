import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { City } from 'src/city/city.entity';

@Entity('Country')
export class Country {
  @PrimaryColumn({ length: 3 })
  declare country_id: string;
  @Column({ length: 50 })
  declare country_name: string;
  @OneToMany(() => City, (city) => city.country)
  declare cities: City[];
}
