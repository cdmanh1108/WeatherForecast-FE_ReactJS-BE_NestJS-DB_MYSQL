import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { City } from 'src/city/city.entity';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  declare userId: number;
  @Column({ length: 25, unique: true })
  declare username: string;
  @Column({ type: 'varchar', length: 25, nullable: true })
  declare fullname: string | null;
  @Column({ type: 'varchar', length: 255, nullable: true })
  declare avatar: string | null;
  @Column({ length: 60 })
  declare email: string;
  @Column({ length: 128 })
  declare password: string;
  @Column({ type: 'varchar', length: 50, nullable: true })
  declare verifyCode: string | null;
  @Column({ type: 'int', nullable: true })
  declare current_city_fk: number | null;
  @Column({ length: 25, default: 'en' })
  declare nd_language: string;
  @Column({ length: 10, default: 'Metric' })
  declare measurement_type: string;
  @Column({ type: 'int', nullable: true })
  declare utc: number | null;
  @Column({ type: 'varchar', length: 50, nullable: true })
  declare status: string | null;
  @Column({ type: 'varchar', length: 10, default: 'USER' })
  declare role: 'USER' | 'ADMIN';
  @ManyToOne(() => City, { nullable: true })
  @JoinColumn({ name: 'current_city_fk' })
  declare currentCity: City | null;
}
