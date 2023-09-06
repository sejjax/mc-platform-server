import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { ReferralUserDto } from 'src/user/referrals/dto/referral-user.dto';
import { GraphicDataInvitedUsersDto } from 'src/user/referrals/dto/graphic-data-invited-users.dto';
import { GraphicDataInvestedFundsDto } from 'src/user/referrals/dto/graphic-data-invested-funds.dto';
import { GraphicDataInvestmentsByTypesDto } from 'src/user/referrals/dto/graphic-data-investments-by-types.dtos';

@Injectable()
export class ReferralsService {
    constructor(
        @InjectRepository(User)
        private usersRepo: Repository<User>,
    ) {
    }

    async getReferrals(userPartnerId: string): Promise<ReferralUserDto[]> {
        const notFullUsersTree: ReferralUserDto[] = await this.getPartOfReferrals(userPartnerId);

        return await Promise.all(notFullUsersTree.map(async refUser => {
            refUser.referrals = await this.getReferrals(refUser.partnerId);
            return refUser;
        }));
    }

    async getPartOfReferrals(userPartnerId: string): Promise<ReferralUserDto[]> {
        return await this.usersRepo.query(
            `
            select
                u."partnerId",
                u."referrerId",
                u."fullName",
                u."mobile",
                u."level" as "refLevel",
                ('/' || f."path") as "avatarURL",
                (
                    select cast(coalesce(sum(c."amount"), 0) as float)
                    from "calculation" c
                    where c."userId" = u."id" and c."status" != 'nulled' and c."accrual_type" = 'product'
                ) as "personalInvestments",
                (   
                    select cast(coalesce(sum(c."amount"), 0) as float)
                    from "calculation" c
                    where c."userId" = u."id" and c."status" != 'nulled' and c."accrual_type" = 'referral'
                ) as "structureInvestments",
                cast((
                    with recursive users_tree as (
                        select u2."partnerId", u2."referrerId"
                        from "user" u2
                        where u2."referrerId" = u."partnerId"
                        union all
                        select u3."partnerId", u3."referrerId"
                        from "user" u3 join users_tree on users_tree."partnerId" = u3."referrerId"
                    )
                    select count(*)
                    from users_tree
                ) as int) as "referralsCount",
                null as "referrals"
            from "user" u
            left join "file" f on u."photoId" = f."id"
            where u."referrerId" = $1
        `, [userPartnerId]);
    }

    async getUserAsReferralUser(user: User) {
        return await this.usersRepo.query(
            `
            select
                u."partnerId",
                u."fullName",
                u."createdAt",
                u."mobile",
                ('/' || f."path") as "avatarURL",
                u.investor_level as "partnerLevel",
                cast((
                    with recursive users_tree as (
                        select u2."partnerId", u2."referrerId"
                        from "user" u2
                        where u2."referrerId" = u."partnerId"
                        union all
                        select u3."partnerId", u3."referrerId"
                        from "user" u3 join users_tree on users_tree."partnerId" = u3."referrerId"
                    )
                    select count(*)
                    from "users_tree" ut
                ) as int) as "usersInStructure",
                (
                    select cast(coalesce(sum(c."amount"), 0) as float)
                    from "calculation" c
                    where c."userId" = u."id" and c."status" != 'nulled' and c."accrual_type" = 'product'
                ) as "personalInvestments",
                (   
                    select cast(coalesce(sum(c."amount"), 0) as float)
                    from "calculation" c
                    where c."userId" = u."id" and c."status" != 'nulled' and c."accrual_type" = 'referral'
                ) as "structureInvestments",
                (
                    select cast(coalesce(sum(c."amount"), 0) as float)
                    from "calculation" c
                    where c."userId" = u."id" and c."status" != 'nulled' and c."accrual_type" = 'passive'
                ) as "passiveInvestments"
            from "user" u
            left join "file" f on u."photoId" = f."id"
            where u."id" = $1
        `, [user.id]);
    }

    async getGraphicInvitedUsers(user: User): Promise<GraphicDataInvitedUsersDto[]> {
        return await this.usersRepo.query(
            `
                with recursive users_tree as (
                    select u2."createdAt", u2."partnerId", u2."referrerId"
                    from "user" u2
                    where u2."referrerId" = $1
                    union all
                    select u3."createdAt", u3."partnerId", u3."referrerId"
                    from "user" u3 join users_tree on users_tree."partnerId" = u3."referrerId"
                )
                select
                    date_trunc('month', ut."createdAt") as "date",
                    
                    cast(sum(count(case when ut."referrerId" = $1 then 1 end))
                        over (order by date_trunc('month', ut."createdAt")) as int) as "invitedPersonal",

                    cast(sum(count(case when ut."referrerId" != $1 then 1 end))
                        over (order by date_trunc('month', ut."createdAt")) as int) as "invitedStructure"
                from users_tree ut
                group by "date"
                order by "date"
        `, [user.partnerId]);
    }

    async getGraphicInvestedFunds(user: User): Promise<GraphicDataInvestedFundsDto[]> {
        return await this.usersRepo.query(
            `
                with recursive users_tree as (
                    select u2."createdAt", u2."id", u2."partnerId", u2."referrerId"
                    from "user" u2
                    where u2."referrerId" = $2 or u2."partnerId" = $2
                    union all
                    select u3."createdAt", u3."id", u3."partnerId", u3."referrerId"
                    from "user" u3 join users_tree on users_tree."partnerId" = u3."referrerId"
                )
                select
                    date_trunc('month', d."createdAt") as "date",

                    cast(sum(sum(d.currency_amount * case when d."userId" = $1 then 1 else 0 end))
                        over (order by date_trunc('month', d."createdAt")) as float) as "investedPersonal",

                    cast(sum(sum(d.currency_amount * case when d."userId" != $1 then 1 else 0 end))
                        over (order by date_trunc('month', d."createdAt")) as float) as "investedStructure"
                from users_tree ut
                inner join "deposit" d on d."userId" = ut."id"
                group by date_trunc('month', d."createdAt")
                order by date_trunc('month', d."createdAt")
        `, [user.id, user.partnerId]);
    }

    async getGraphicInvestmentsByTypes(user: User): Promise<GraphicDataInvestmentsByTypesDto[]> {
        return await this.usersRepo.query(
            `
                select
                    date_trunc('month', c."createdAt") as "date",

                    cast(sum(sum(c.amount * case when c.accrual_type = 'product' then 1 else 0 end))
                        over (order by date_trunc('month', c."createdAt")) as float) as "personalInvestments",

                    cast(sum(sum(c.amount * case when c.accrual_type = 'referral' then 1 else 0 end))
                        over (order by date_trunc('month', c."createdAt")) as float) as "structureInvestments",

                    cast(sum(sum(c.amount * case when c.accrual_type = 'passive' then 1 else 0 end))
                        over (order by date_trunc('month', c."createdAt")) as float) as "passiveInvestments"

                from "calculation" c
                where c.status != 'nulled' and c."userId" = $1
                group by date_trunc('month', c."createdAt")
                order by date_trunc('month', c."createdAt")
        `, [user.id]);
    }
}