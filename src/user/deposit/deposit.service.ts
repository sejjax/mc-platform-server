import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Deposit } from 'src/user/deposit/entities/deposit.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { InvestorProDepositAmountReponse } from './deposit.types';
import { GetInvestmentSummaryDto } from "./dto/get-investment-summary.dto";
import { GetLastMonthPassiveIncome } from "./dto/get-last-month-passive-income.dto";
import { QueryResult } from "../../types/queryResult";

@Injectable()
export class DepositService {
  constructor(
    @InjectRepository(Deposit)
    private depositRepo: Repository<Deposit>,
  ) {}

  async findByUser(user: User): Promise<Deposit[]> {
    return await this.depositRepo.find({
        where: { user },
        order: { date: 'ASC' },
      });
  }

  async getInvestorProAmountByUser(userId: number): Promise<InvestorProDepositAmountReponse> {
    const [{ sum: allPackages }] = (await this.depositRepo.query(
      `select cast(coalesce(sum(d.currency_amount),0)as int) as sum from "public".deposit d where d.product_service_description like 'investor_pro%' and d.product_service_description != 'investor_pro_gamefi'`,
    )) as [{ sum: number }];

    const [{ sum: perUser }] = (await this.depositRepo.query(
      `select cast(coalesce(sum(d.currency_amount),0)as int) as sum from "public".deposit d where d.product_service_description like 'investor_pro%' and d.product_service_description != 'investor_pro_gamefi' and d."userId" = $1`,
      [userId],
    )) as [{ sum: number }];

    return { allPackages, perUser };
  }

  async investmentSummary(user: User): Promise<GetInvestmentSummaryDto> {
    const [{ 
      currentInvestmentAmount,
      totalPayedAmount,
      totalInvestedAmount,
      payReadyAmount
    }] = await this.depositRepo.query(
        `
            select (
              select cast(coalesce(sum(d.currency_amount), 0) as int)
              from "user" u 
              left outer join deposit d on u.id=d."userId" 
              where d.status='calculated' and now() < d."date" + interval '1 week' * cast(d.ip_wks as int) and u.id=$1
            ) as "currentInvestmentAmount",
            (
              select cast(coalesce(sum(wh.currency_amount), 0) as int)
              from "user" u 
              left outer join withdraw_history wh on u.id=wh."userId" 
              where u.id=$1
            ) as "totalPayedAmount",
            (
              select cast(coalesce(sum(d.currency_amount), 0) as int)
              from "user" u 
              left outer join deposit d on u.id=d."userId" 
              where d.status='calculated' and u.id=$1
            ) as "totalInvestedAmount",
            (
              select cast(coalesce(b.available_to_withdraw_balance, 0) as int)
              from "user" u 
              left outer join balance b on u.id=b."userId" 
              where u.id=$1
            ) as "payReadyAmount"`,
        [user.id]
    ) as [GetInvestmentSummaryDto];
    return {
      currentInvestmentAmount,
      totalPayedAmount,
      totalInvestedAmount,
      payReadyAmount
    };
  }

  async lastMonthPassiveIncome(user: User): Promise<GetLastMonthPassiveIncome> {
    const [{ result }] = await this.depositRepo.query(
      `select cast(coalesce(sum(c.amount), 0) as int) as result from "user" u 
              left outer join calculation c on u.id=c."userId" 
              where c.status='sent' and
              c.accrual_type='product' and 
              date_trunc('month', c.payment_date) >= date_trunc('month', current_date) and
              u.id=$1
        `,
        [user.id]
    ) as QueryResult<number>;
    return {amount: result};
  }
}
