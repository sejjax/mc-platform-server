import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBuyProjectTokensDto } from 'src/user/buy-project-tokens/dto/create-buy-project-tokens.dto';
import { BuyProjectTokens } from 'src/user/buy-project-tokens/entities/buy-project-tokens.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BuyProjectTokensService {
  constructor(
    @InjectRepository(BuyProjectTokens)
    private buyProjectTokensRepo: Repository<BuyProjectTokens>,
  ) {}

  async createOrUpdate(
    createWithdrawHistoryDto: CreateBuyProjectTokensDto,
  ): Promise<BuyProjectTokens> {
    return await this.buyProjectTokensRepo.save(createWithdrawHistoryDto);
  }

  async findByUser(user: User): Promise<BuyProjectTokens[]> {
    return (
      (await this.buyProjectTokensRepo.find({
        where: { user },
        order: { Unlock_date: 'DESC' },
      })) || ([] as BuyProjectTokens[])
    );
  }
}
