import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: (req: Request): string | null => {
        if (
          typeof req.cookies === 'object' &&
          req.cookies !== null &&
          'access_token' in req.cookies &&
          typeof req.cookies['access_token'] === 'string'
        ) {
          return req.cookies['access_token'];
        }
        return null;
      },
      ignoreExpiration: false,
      secretOrKey: config.get<string>('jwt.secret', 'localhost'),
    });
  }

  validate(payload: JwtPayload) {
    return { sub: payload.sub, username: payload.username };
  }
}
