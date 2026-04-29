// src/auth/strategies/jwt-refresh.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh'
) {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: (req: Request) => {
        if (req.cookies) return req.cookies['refresh_token'];
        return null;
      },
      ignoreExpiration: false,
      secretOrKey: config.get<string>('jwt.refresh_secret', 'localhost'),
    });
  }

  validate(payload: JwtPayload) {
    return { sub: payload.sub, username: payload.username };
  }
}
