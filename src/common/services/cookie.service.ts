// src/common/services/cookie.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response, CookieOptions } from 'express';

@Injectable()
export class CookieService {
  constructor(public configService: ConfigService) {}

  setCookie(
    res: Response,
    name: string,
    value: string,
    options?: CookieOptions,
  ): void {
    const defaultOptions: CookieOptions = {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'lax',
    };

    res.cookie(name, value, { ...defaultOptions, ...options });
  }

  clearCookie(res: Response, name: string, options?: CookieOptions): void {
    res.clearCookie(name, options);
  }
}
