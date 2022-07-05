import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { getEnvPath } from './common/helper/env.helper';
import { UsersModule } from './api/users/users.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './api/auth/auth.module';
import { JwtAuthGuard } from './api/auth/guards/jwt-auth.guard';
import { ForgotPasswordModule } from './api/forgotPassword/forgot-password.module';
import { PermissionsModule } from './api/permissions/permissions.module';
import { PermissionsGuard } from './api/auth/guards/permissions.guard';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    AuthModule,
    HealthModule,
    UsersModule,
    ForgotPasswordModule,
    PermissionsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}
