import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserWithRefs } from 'src/metrics/metrics.types';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { Deposit } from '../deposit/entities/deposit.entity';
import {
  AccrualType,
  CalculationPercentsFromLevel,
  CalculationWithByOrder,
  Status,
} from './calculations.types';
import { CreateCalculationsDto } from './dto/create-calculations.dto';
import { Calculation } from './entities/calculation.entity';

@Injectable()
export class CalculationsService {
  constructor(
    @InjectRepository(Calculation)
    private calculationsRepo: Repository<Calculation>,
  ) {}

  async createCalculation(body: CreateCalculationsDto) {
    const calculation = await this.calculationsRepo.save(body);
    return calculation;
  }

  async generateCalculationsFromReferralsArray(
    referalsArray: User[],
    userAmount: string,
    product: Deposit,
    userPartner: User,
  ) {
    let prevPercent = 0;

    for (let index = 0; index < referalsArray.length; index++) {
      const user = referalsArray[index];
      const userPercent = CalculationPercentsFromLevel[user.level];
      const userPercentStr = (userPercent - prevPercent).toString();

      const referralAmount = (+userAmount * (userPercent - prevPercent)) / 100;

      // const roundendAmount = Math.floor(referralAmount * 1000) / 1000;

      prevPercent = userPercent;
      const calculation = {
        user,
        product,
        accrual_type: AccrualType.referral,
        amount: referralAmount,
        wallet_addr: user.default_wallet_address,
        percent: userPercentStr,
        payment_date: new Date(),
        userPartner,
      };
      await this.calculationsRepo.save(calculation);
    }
  }

  async getCalculationsByUser(
    user: User | UserWithRefs,
    type: AccrualType,
  ): Promise<(Calculation | CalculationWithByOrder)[]> {


    const calculations = await this.calculationsRepo
      .createQueryBuilder('calculation')
      .leftJoinAndSelect('calculation.product', 'product')
      .leftJoinAndSelect('calculation.userPartner', 'userPartner')
      .where('calculation.accrual_type=:accrualType and calculation.userId=:userId', {
        accrualType: AccrualType[type],
        userId: user.id,
      })
      .select([
        'calculation.accrual_type',
        'calculation.id',
        'calculation.amount',
        'calculation.payment_date',
        'product.product',
        'product.id',
        'calculation.status',
        'calculation.wallet_addr',
        'calculation.percent',
        'userPartner.fullName',
        'userPartner.partnerId',
      ])
      .getMany();
    if (type === 'product') {
      const ids: number[] = [];
      for (const calculation of calculations) {
        if (!ids.includes(calculation.product.id)) ids.push(calculation.product.id);
      }
      ids.sort();
      return calculations.map<CalculationWithByOrder>((calculation) => ({
        ...calculation,
        buyOrder: ids.indexOf(calculation.product.id) + 1,
      }));
    }
    return calculations;
  }

  async getReferralsCalculationsByUser(user: User) {
    const calculations = await this.calculationsRepo.find({
      where: {
        user,
        accrual_type: AccrualType.referral,
      },
    });
    return calculations;
  }

  async getDepositCalculationsByUser(user: User) {
    const calculations = await this.calculationsRepo.find({
      where: {
        user,
        accrual_type: AccrualType.product,
      },
    });
    return calculations;
  }

  async isDepositCalculationsSended(deposit: Deposit) {
    const calculations = await this.calculationsRepo.find({
      where: {
        product: deposit,
        accrual_type: AccrualType.product,
      },
    });
    for (const calculation of calculations) {
      if (calculation.status === Status.waiting) return false;
    }
    return true;
  }
}
