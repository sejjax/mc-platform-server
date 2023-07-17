import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/user.entity';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import { CalculationsService } from './calculations.service';
import { RequestRefsCalculationsDto } from "./dto/request-refs-calculations.dto";
import { AccrualType } from "./calculations.types";
import { RequestDepositCalculationsDto } from "./dto/request-deposit-calculations.dto";
import { ResponseCalculationsSummaryDto } from "./dto/response-calculations-summary.dto";

@Controller('calculations')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@ApiTags('User calculations')
export class CalculationsController {
  constructor(private calculationsService: CalculationsService) {}

  @Get('/referrals')
  async getRefsCalculations(@AuthUser() user: User, @Body() requestDto: RequestRefsCalculationsDto) {
    return await this.calculationsService.getCalculationsByUser(
      user,
      requestDto.referralType,
    );
  }
  @Get('/deposit')
  async getDepositCalculations(@AuthUser() user: User, @Body() {dateFrom, dateTo}: RequestDepositCalculationsDto) {
    return await this.calculationsService.getCalculationsByUser(
      user,
      AccrualType.product,
      dateFrom,
      dateTo
    );
  }

  @Get('/summary')
  async calculationsSummary(@AuthUser() user: User): Promise<ResponseCalculationsSummaryDto> {
      return await this.calculationsService.calculationsSummary(user)
  }
}
