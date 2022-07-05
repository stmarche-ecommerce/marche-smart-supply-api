import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  HealthIndicator,
} from '@nestjs/terminus';
import { IsPublic } from '../api/auth/decorators/is-public.decorator';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Health check')
@Controller('health')
export class HealthController extends HealthIndicator {
  constructor(
    private health: HealthCheckService,
    private readonly db: PrismaService,
  ) {
    super();
  }

  @Get()
  @IsPublic()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.$queryRaw`SELECT 'up' as 'status'`,
    ]);
  }
}
