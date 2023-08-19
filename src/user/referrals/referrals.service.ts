import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { ReferralUserDto } from 'src/user/referrals/dto/referral-user.dto';

@Injectable()
export class ReferralsService {
    constructor(
        @InjectRepository(User)
        private usersRepo: Repository<User>,
    ) {
    }

    async getReferrals(userPartnerId: string, refLevel: number = 0): Promise<ReferralUserDto[]> {
        const notFullUsersTree: ReferralUserDto[] = await this.usersRepo.query(
            `
            select
                u."partnerId" as "partnerId",
                u."fullName" as "fullName",
                u."mobile" as "mobile",
                cast($2 as int) as "refLevel",
                (
                    select cast(coalesce(sum(c."amount"), 0) as float)
                    from "calculation" c
                    where c."userId" = u."id" and c."status" != 'nulled' and c."accrual_type" = 'product'
                ) as "personalInvestments",
                (   
                    select cast(coalesce(sum(c."amount"), 0) as float)
                    from "calculation" c
                    where c."userId" = u."id" and c."status" != 'nulled' and c."accrual_type" = 'referral'
                ) as "structureInvestments"
            from "user" u
            where u."referrerId" = $1
        `, [userPartnerId, refLevel]);

        return await Promise.all(notFullUsersTree.map(async refUser => {
            refUser.referrals = await this.getReferrals(refUser.partnerId, refUser.refLevel + 1);
            return refUser;
        }));
    }
}