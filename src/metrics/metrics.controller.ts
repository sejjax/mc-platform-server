import { Controller, Get, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/roles/consts';
import { Roles } from 'src/roles/roles.decorator';
import { RoleGuard } from 'src/roles/roles.guard';
import { MetricsService } from './metrics.service';

@Controller('metrics')
@ApiTags('Metrics')
export class MetricsController {
    constructor(private metricsService: MetricsService, private configService: ConfigService) {}

  @ApiBearerAuth()
  @Get()
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(Role.metrics)
    async getMetricsData() {
        return this.metricsService.getMetricsData();
    }

  @Get('/next_payments')
  async getNextPaymentsAmount(
    @Query('key') key?: string,
    @Query('days', ParseIntPipe) days?: number,
  ) {
      if (!key || !days || key !== this.configService.get('auth.secret'))
          throw new ForbiddenException();
      return this.metricsService.getNextPaymentsByDays(days);
  }
}
