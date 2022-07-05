import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ForgotPasswordService } from './forgot-password.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { IsPublic } from '../auth/decorators/is-public.decorator';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Reset password')
@Controller('password')
export class ForgotPasswordController {
  constructor(private readonly forgotPasswordService: ForgotPasswordService) {}

  @IsPublic()
  @Post('forgot')
  @HttpCode(HttpStatus.OK)
  sendEmailForgot(@Body() data: ForgotPasswordDto) {
    return this.forgotPasswordService.sendForgot(data);
  }

  @IsPublic()
  @Post('reset')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() data: ResetPasswordDto) {
    return this.forgotPasswordService.resetPassword(data);
  }
}
