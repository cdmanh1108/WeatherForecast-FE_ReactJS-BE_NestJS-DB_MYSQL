/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';

export class CreateUserRequest {
  @IsString()
  username: string;

  @IsString()
  fullName: string;

  @IsString()
  @MinLength(6)
  password: string;
}
