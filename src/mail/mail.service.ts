import { join } from 'path';
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../api/users/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}
  async sendResetPassword(user: User, token: string) {
    const url = `${process.env.URI_RESET_PASSWORD}${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Recuperação de Senha | Supply',
      template: join(__dirname, 'templates', 'forgotPassword'),
      context: {
        name: user.name,
        email: user.email,
        url,
      },
    });
  }
}
