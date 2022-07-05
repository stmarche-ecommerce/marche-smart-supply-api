import { Module } from '@nestjs/common';
import { ForgotPasswordService } from './forgot-password.service';
import { ForgotPasswordController } from './forgot-password.controller';
import { UsersModule } from '../users/users.module';
import { MailModule } from '../../mail/mail.module';

@Module({
  controllers: [ForgotPasswordController],
  providers: [ForgotPasswordService],
  imports: [UsersModule, MailModule],
})
export class ForgotPasswordModule {}
