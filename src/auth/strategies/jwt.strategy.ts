import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import { ConfigService } from '@nestjs/config';
import { IDecodedToken } from '../auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // Custom extractor to read from cookie
        (req: Request): string | null => {
          return (req?.cookies?.access_token as undefined) || null;
        },
        // Fallback to Authorization header
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_AUTH_SECRET')!,
    });
  }

  validate(payload: IDecodedToken) {
    return { ...payload };
  }
}
