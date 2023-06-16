import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWalletHistoryDto } from 'src/user/wallet-history/dto/create-wallet-history.dto';
import { WalletHistory } from 'src/user/wallet-history/entities/wallet-history.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WalletHistoryService {
  constructor(
    @InjectRepository(WalletHistory)
    private walletHistoryRepo: Repository<WalletHistory>,
  ) {}

  async createOrUpdate(
    createWalletHistoryDto: CreateWalletHistoryDto,
  ): Promise<WalletHistory> {
    return await this.walletHistoryRepo.save(createWalletHistoryDto);
  }

  async findByUser(user: User): Promise<WalletHistory[]> {
    return (
      (await this.walletHistoryRepo.find({
        where: { user },
        order: { date: 'DESC' },
      })) || ([] as WalletHistory[])
    );
  }
}
