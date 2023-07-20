import {
  Controller,
  Get, HttpException,
  Param,
  Query,
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
import { isGuid } from "./helpers/isGuid";
import { RequestDepositsDto } from "./dto/request-deposits.dto";
import { foundCheck } from "../../utils/helpers/notFoundCheck";

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

  @Get('/investment-summary')
  async getTotalInvestedAmount(@AuthUser() user: User): Promise<GetInvestmentSummaryDto> {
    return await this.depositService.investmentSummary(user);
  }

  @Get('/find-by-user-id/:id')
  async findByUserId(@AuthUser() user: User, @Param('id') id: number) {
    if (user.id !== +id) if (!user.isAdmin) throw new UnauthorizedException();
    return this.depositService.findById(id)
  }

  @Get('/:idOrGuid?')
  async findByIdOrGuid(
      @AuthUser() user: User,
      @Query() query: RequestDepositsDto,
      @Param('idOrGuid') idOrGuid?: string
  ) {
    const result = await this.depositService.findByUser(user, query, idOrGuid)
    foundCheck(result, "Deposit not found");
    return result
  }
}
