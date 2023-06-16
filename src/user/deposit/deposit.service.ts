import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Deposit } from 'src/user/deposit/entities/deposit.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { InvestorProDepositAmountReponse } from './deposit.types';

@Injectable()
export class DepositService {
  constructor(
    @InjectRepository(Deposit)
    private depositRepo: Repository<Deposit>,
  ) {}

  async findByUser(user: User): Promise<Deposit[]> {
    return (
      (await this.depositRepo.find({
        where: { user },
        order: { date: 'DESC' },
      })) || ([] as Deposit[])
    );
  }

  async getInvestorProAmountByUser(userId: number): Promise<InvestorProDepositAmountReponse> {
    const [{ sum: allPackages }] = (await this.depositRepo.query(
      `select cast(coalesce(sum(d.currency_amount),0)as int) as sum from public.deposit d where d.product_service_description like 'investor_pro%' and d.product_service_description != 'investor_pro_gamefi'`,
    )) as [{ sum: number }];

    const [{ sum: perUser }] = (await this.depositRepo.query(
      `select cast(coalesce(sum(d.currency_amount),0)as int) as sum from public.deposit d where d.product_service_description like 'investor_pro%' and d.product_service_description != 'investor_pro_gamefi' and d."userId" = $1`,
      [userId],
    )) as [{ sum: number }];

    return { allPackages, perUser };
  }
}
