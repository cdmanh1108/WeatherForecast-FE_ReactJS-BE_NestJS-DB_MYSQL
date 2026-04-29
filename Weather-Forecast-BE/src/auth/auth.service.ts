import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from 'src/common/utils/hash.util';
import { ConfigService } from '@nestjs/config';
import { ApiException, ERROR_CODES } from 'src/common/exceptions/api-exception';
import { mapUserToUserProfileResponse } from 'src/user/dto/response/user-profile.response';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly config: ConfigService
  ) {}

  async login(username: string, password: string) {
    const user = await this.userService.findOne(username);
    if (!user) {
      throw new ApiException(
        'Invalid username',
        400,
        ERROR_CODES.INVALID_USERNAME
      );
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      throw new ApiException(
        'Invalid password',
        401,
        ERROR_CODES.INVALID_PASSWORD
      );
    }
    const payload = { sub: user.userId, username: user.username };
    const access_token = await this.jwtService.signAsync(payload, {
      secret: this.config.getOrThrow<string>('jwt.secret'),
    });
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.config.getOrThrow<string>('jwt.refresh_secret'),
    });

    return {
      access_token,
      refresh_token,
      user: mapUserToUserProfileResponse(user),
    };
  }

  async me(username: string) {
    const user = await this.userService.findOne(username);
    if (!user) {
      throw new ApiException('User not found', 401, ERROR_CODES.USER_NOT_FOUND);
    }
    return mapUserToUserProfileResponse(user);
  }
}
