import { Module } from '@nestjs/common';

import { NodemailerService } from './services/nodemailer.service';
import { CookieService } from './services/cookie.service';

@Module({
  providers: [NodemailerService, CookieService],
  exports: [NodemailerService, CookieService],
})
export class CommonModule {}
