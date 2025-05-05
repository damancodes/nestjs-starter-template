import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { Strategy, Profile } from 'passport-google-oauth20';
import { UsersService } from 'src/users/users.service';
import { Provider } from 'src/users/entities/user.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    public configService: ConfigService,
    public users: UsersService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID')!,
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET')!,
      scope: ['email', 'profile'],
      callbackURL: `${configService.get('BASE_URL')}/auth/google-redirect`,
    });
  }

  async validate(
    _: string,
    __: string,
    id_token: Profile,
    ___: number,
    ____: string,
    _____: string,
  ) {
    //removig unused variable erro
    void ___;
    void _____;

    const email = id_token.emails?.at(0)?.value as string;
    const existingUser = await this.users.findOne({ email: email });
    if (existingUser) return existingUser;

    const createdUser = await this.users.create({
      email: email,
      isVerified: true,
      provider: Provider.GOOGLE,
    });
    return createdUser;
  }
}
