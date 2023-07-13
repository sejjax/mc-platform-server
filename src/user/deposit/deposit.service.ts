import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Deposit } from 'src/user/deposit/entities/deposit.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { InvestorProDepositAmountReponse } from './deposit.types';
import { GetDepositDto } from "./dto/get-deposit.dto";
import { isDepositClosed } from "./helpers/isDepositClosed";
import { GetTotalInvestedAmountDto } from "./dto/get-total-invested-amount.dto";

@Injectable()
export class DepositService {
  constructor(
    @InjectRepository(Deposit)
    private depositRepo: Repository<Deposit>,
  ) {}

  async findByUser(user: User): Promise<GetDepositDto[]> {
    return (
      (await this.depositRepo.find({
        where: { user },
        order: { date: 'DESC' },
      })) || []
    ).map((it, idx) => ({
      ...it,
      relativeId: idx,
      isClosed: isDepositClosed(it),
    })) as GetDepositDto[];
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

  async getTotalInvestedAmount(user: User): Promise<GetTotalInvestedAmountDto> {
    const [{ sum }] = await this.depositRepo.query(
        `select cast(sum(d.currency_amount) as int) from "user" u left outer join deposit d on u.id=d."userId" where u.id=$1 group by d.currency`,
        [user.id]
    ) as [{ sum: number }];
    return {amount: sum};
  }
}
