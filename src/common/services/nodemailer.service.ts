import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NodemailerService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
  private options: {
    user: '';
    pass: '';
  };
  constructor(public configService: ConfigService) {
    this.options = {
      user: this.configService.get('NODEMAILER_USER')!,
      pass: this.configService.get('NODEMAILER_PASSWORD')!,
    };

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com', // ✅ FIXED: Correct Gmail SMTP host
      port: 587,
      secure: false,
      auth: {
        user: this.options.user,
        pass: this.options.pass,
      },
    }); // ✅ Cast to the correct type
  }

  async sendMail(to: string, subject: string, html: string) {
    try {
      const info = await this.transporter.sendMail({
        from: `"My App" <${this.options.user}>`,
        to,
        subject,
        html,
      });

      return info;
    } catch (err) {
      if (err instanceof Error) {
        throw new InternalServerErrorException(
          `Failed to send email: ${err.message}`,
        );
      }
      throw new InternalServerErrorException(
        'Unknown error while sending email',
      );
    }
  }
}
