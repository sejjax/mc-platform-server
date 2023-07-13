import { Controller, Get, Param, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DepositService } from 'src/user/deposit/deposit.service';
import { User } from 'src/users/user.entity';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import { InvestorProDepositAmountReponse } from './deposit.types';
import { GetTotalInvestedAmountDto } from "./dto/get-total-invested-amount.dto";
import { GetLastMonthPassiveIncome } from "./dto/get-last-month-passive-income.dto";

@UseGuards(AuthGuard('jwt'))
@ApiTags('User deposit history')
@ApiBearerAuth()
@Controller('user/deposit')
export class DepositController {
  constructor(private depositService: DepositService) {}

  @Get('/investor_pro_amount')
  async getInvestorProAmount(@AuthUser() user: User): Promise<InvestorProDepositAmountReponse> {
    return this.depositService.getInvestorProAmountByUser(user.id);
  }

  @Get('/')
  async findMy(@Req() req: Request & { user: User }) {
    return this.depositService.findByUser(req.user);
  }

  @Get('/total-invested-amount')
  async getTotalInvestedAmount(@AuthUser() user: User): Promise<GetTotalInvestedAmountDto> {
    return await this.depositService.getTotalInvestedAmount(user);
  }

  @Get('/passive-income/last-month')
  async lastMonthPassiveIncome(@AuthUser() user: User): Promise<GetLastMonthPassiveIncome> {
    return await this.depositService.lastMonthPassiveIncome(user);
  }

  @Get('/:id')
  async findByUserId(@AuthUser() user: User, @Param('id') id: string) {
    if (user.id !== +id) if (!user.isAdmin) throw new UnauthorizedException();
    return this.depositService.findByUser({ id: id } as unknown as User);
  }
}
