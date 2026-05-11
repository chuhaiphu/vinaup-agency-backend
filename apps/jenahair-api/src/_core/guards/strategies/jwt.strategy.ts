import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import authConfig from 'src/_core/configs/auth.config';
import type { ConfigType } from '@nestjs/config';
import {
  JwtPayload,
  JwtValidationReturn,
} from 'src/_common/interfaces/interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(authConfig.KEY)
    appConf: ConfigType<typeof authConfig>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request): string | null => {
          return (request.cookies?.atk as string) || null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: appConf.jwt.secret,
    });
  }

  validate(payload: JwtPayload): JwtValidationReturn {
    return { userId: payload.sub };
  }
}
