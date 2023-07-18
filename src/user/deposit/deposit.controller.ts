import {
  Controller,
  Get,
  Param,
  Req,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DepositService } from 'src/user/deposit/deposit.service';
import { User } from 'src/users/user.entity';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import { InvestorProDepositAmountReponse } from './deposit.types';
import { GetInvestmentSummaryDto } from "./dto/get-investment-summary.dto";
import { GetLastMonthPassiveIncome } from "./dto/get-last-month-passive-income.dto";
import { isGuid } from "./helpers/isGuid";
import { foundCheck } from "../../helpers/notFoundCheck";

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

  @Get('/investment-summary')
  async getTotalInvestedAmount(@AuthUser() user: User): Promise<GetInvestmentSummaryDto> {
    return await this.depositService.investmentSummary(user);
  }

  @Get('/passive-income/last-month')
  async lastMonthPassiveIncome(@AuthUser() user: User): Promise<GetLastMonthPassiveIncome> {
    return await this.depositService.lastMonthPassiveIncome(user);
  }

  @Get('/find-by-user-id/:id')
  async findByUserId(@AuthUser() user: User, @Param('id') id: string) {
    if (user.id !== +id) if (!user.isAdmin) throw new UnauthorizedException();
    return this.depositService.findByUser({ id: id } as unknown as User);
  }

  @Get('/:idOrGuid')
  async findByIdOrGuid(
      @AuthUser() user: User,
      @Param('idOrGuid') idOrGuid: string,
  ) {
    let result;

    if(isGuid(idOrGuid)) result = await this.depositService.findDepositByGuid(idOrGuid)
    else result = await this.depositService.findById(Number(idOrGuid))

    foundCheck(result, "Deposit not found");
    return result
  }
}
