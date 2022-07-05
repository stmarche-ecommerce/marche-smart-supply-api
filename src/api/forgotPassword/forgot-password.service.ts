import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as dayjs from 'dayjs';
import { v4 as uuid } from 'uuid';
import { MailService } from '../../mail/mail.service';
import { PrismaService } from '../../prisma/prisma.service';
import { hash } from 'bcrypt';

@Injectable()
export class ForgotPasswordService {
  constructor(
    private readonly userService: UsersService,
    private mailService: MailService,
    private prisma: PrismaService,
  ) {}

  async sendForgot({ email }: ForgotPasswordDto) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new HttpException('User does not exists', HttpStatus.NOT_FOUND);
    }

    const expires_in_token = dayjs().add(48, 'hour').toDate();
    const token = uuid();

    await this.userService.update(user.id, {
      expires_in_token,
      token,
    });

    return this.mailService.sendResetPassword(user, token);
  }

  async resetPassword({ token, password }: ResetPasswordDto) {
    const user = await this.prisma.users.findFirst({
      where: {
        token: token,
      },
    });

    if (!user) {
      throw new HttpException('token not found', HttpStatus.GONE);
    }

    const tokenIsExpired = dayjs(user.expires_in_token).isBefore(dayjs());

    if (tokenIsExpired) {
      throw new HttpException('token expired', HttpStatus.GONE);
    }

    await this.userService.update(user.id, {
      expires_in_token: null,
      token: '',
      password: await hash(password, 10),
    });
  }
}
