import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/user.entity';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import { CalculationsService } from './calculations.service';

@Controller('calculations')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@ApiTags('User calculations')
export class CalculationsController {
  constructor(private calculationsService: CalculationsService) {}

  @Get('/referrals')
  async getRefsCalculations(@AuthUser() user: User) {
    return await this.calculationsService.getCalculationsByUser(
      user,
      'referral',
    );
  }
  @Get('/deposit')
  async getDepositCalculations(@AuthUser() user: User) {
    return await this.calculationsService.getCalculationsByUser(
      user,
      'product',
    );
  }
}
