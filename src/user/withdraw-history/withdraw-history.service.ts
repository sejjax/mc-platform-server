import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWithdrawHistoryDto } from 'src/user/withdraw-history/dto/create-withdraw-history.dto';
import { WithdrawHistory } from 'src/user/withdraw-history/entities/withdraw-history.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WithdrawHistoryService {
  constructor(
    @InjectRepository(WithdrawHistory)
    private withdrawHistoryRepo: Repository<WithdrawHistory>,
  ) {}

  async createOrUpdate(
    createWithdrawHistoryDto: CreateWithdrawHistoryDto,
  ): Promise<WithdrawHistory> {
    return await this.withdrawHistoryRepo.save(createWithdrawHistoryDto);
  }

  async findByUser(user: User): Promise<WithdrawHistory[]> {
    return (
      (await this.withdrawHistoryRepo.find({
        where: { user },
        order: { date: 'DESC' },
      })) || ([] as WithdrawHistory[])
    );
  }
}
