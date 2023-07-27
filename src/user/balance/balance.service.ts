import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Balance } from 'src/user/balance/entities/balance.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateBalanceDto } from 'src/user/balance/dto/create-balance.dto';

@Injectable()
export class BalanceService {
    constructor(
    @InjectRepository(Balance)
    private userBalanceRepo: Repository<Balance>,
    ) {}

    async createOrUpdate(createUserBalanceDto: CreateBalanceDto) {
        const inserted = await this.userBalanceRepo.upsert(createUserBalanceDto, [
            'user',
        ]);
        return await this.userBalanceRepo.findOne({
            id: inserted.identifiers[0].id,
        });
    }

    async findByUser(user: User) {
        return (
            (await this.userBalanceRepo.findOne({
                where: { user },
            })) ||
      ({
          available_to_withdraw_balance: 0,
          current_platform_balance: 0,
      } as Balance)
        );
    }
}
