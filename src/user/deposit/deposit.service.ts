import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Deposit } from 'src/user/deposit/entities/deposit.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { Id, InvestorProDepositAmountReponse } from './deposit.types';
import { GetInvestmentSummaryDto } from "./dto/get-investment-summary.dto";
import { depositIdFromGuid } from "./helpers/depositIdFromGuid";
import { RequestDepositsDto } from "./dto/request-deposits.dto";
import { isGuid } from "./helpers/isGuid";
import { dbFormat, epochStart, now } from "../../utils/helpers/date";

@Injectable()
export class DepositService {
  constructor(
    @InjectRepository(Deposit)
    private depositRepo: Repository<Deposit>,
  ) {}

    async findById(id: Id): Promise<Deposit | undefined> {
        return this.depositRepo.findOne(id);
    }

    async findByUser(user: User, { pagination, filters, orderBy }: RequestDepositsDto, idOrGuid?: string): Promise<Deposit[] | Deposit> {
        let id = undefined;
        if(idOrGuid != null && isGuid(idOrGuid))
            id = depositIdFromGuid(idOrGuid)
        else if(idOrGuid != null)
           id = Number(idOrGuid)

        if(id != null)
            return await this.depositRepo.findOne(id)

        let {dateFrom, dateTo, ...remainedFilters} = filters;

        dateFrom = dateFrom ?? epochStart()
        dateTo = dateTo ?? now()

        return await this.depositRepo
            .createQueryBuilder('d')
            .where({ user, ...remainedFilters })
            .where(`
                d.date between :dateFrom and :dateTo
                `, {
                dateFrom: dbFormat(dateFrom),
                dateTo: dbFormat(dateTo),
            })
            .orderBy(orderBy)
            .skip(pagination.skip)
            .take(pagination.take)
            .getMany();
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
}
