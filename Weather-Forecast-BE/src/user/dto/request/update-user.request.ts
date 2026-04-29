import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateUserFullnameRequest {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  fullname?: string;
}

export class UpdateUserLocationRequest {
  @IsLatitude()
  latitude!: number;

  @IsLongitude()
  longitude!: number;
}
