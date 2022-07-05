import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { IsPublic } from './decorators/is-public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';

@ApiTags('Session')
@ApiUnauthorizedResponse({ description: 'Unauthorized.' })
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, schema: { example: { accessToken: 'string' } } })
  @ApiUnauthorizedResponse({
    description: 'Email or password is incorrect.',
  })
  @IsPublic()
  @Post('login')
  @UseGuards(AuthGuard('local'))
  login(@CurrentUser() user) {
    return this.authService.login(user);
  }

  @Get('me')
  @ApiResponse({ status: 200, type: CreateUserDto })
  getMe(@CurrentUser() user) {
    return this.usersService.findOne(user.id);
  }
}
