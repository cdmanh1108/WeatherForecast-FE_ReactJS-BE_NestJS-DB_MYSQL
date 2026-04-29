import {
  IsOptional,
  IsString,
  IsNumber,
  MinLength,
  IsLatitude,
  IsLongitude,
} from 'class-validator';

export class UpdateUserFullnameRequest {
  @IsOptional()
  @IsString()
  fullname: string;
}

export class UpdateUserCurrentCityRequest {
  @IsOptional()
  @IsNumber()
  current_city_fk: number;
}

export class UpdateUserPasswordRequest {
  @IsString()
  @MinLength(6)
  password: string;
}

export class UpdateUserLocationRequest {
  @IsLatitude()
  latitude: number;

  @IsLongitude()
  longitude: number;
}
