import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { assign } from 'src/utils/assign';
import { BaseEntityService, ID } from 'src/base/base-entity.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { User } from 'src/users/user.entity';
import { DeepPartial, Like, Repository } from 'typeorm';
import { Accrual } from 'src/users/accrual.entity';
import { FilesService } from 'src/files/files.service';
import { FileDto } from 'src/files/dto/file.dto';
import { Team } from 'src/team/entities/team.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Deposit } from 'src/user/deposit/entities/deposit.entity';
import { Calculation } from 'src/user/calculations/entities/calculation.entity';
import { ReturnUserDto } from './dto/return-user.dto';
import { CalculationsService } from 'src/user/calculations/calculations.service';
import { DepositStatus } from 'src/user/deposit/deposit.types';
import {
    allStructureLevels,
    CreateUserConfirmDto,
    firstStructureLevels,
    GetReferralsUserFromCustomQuery,
    GetReferralsUserWithDepositAmountFromCustomQuery,
    IUserDataWithRole,
    TeamUserStructure,
    UserFilter,
    UserIdentifierDto,
} from './users.types';
import { getTeamTreeQuery, getTeamTreeQueryWithDepositAmount, TeamTreeQueryItem, } from 'src/utils/helpers/getTeamTree';
import { SetAgreementDto } from './dto/set-agreement.dto';
import { Status } from 'src/user/calculations/calculations.types';
import { plainToInstance } from 'class-transformer';
import { TeamInfoDto } from './dto/team-info.dto';
import { ResponseReferralsCountDto } from './dto/response-referrals-count.dto';
import {ReferralCount} from './users.types';
import { QueryResult } from '../utils/types/queryResult';
import { RequestTeamStructureReferralsDto } from 'src/users/dto/request-team-structure.dto';

@Injectable()
export class UsersService extends BaseEntityService<User, UserFilter> {
    constructor(
    private readonly filesService: FilesService,
    @InjectRepository(Deposit) private depositRepo: Repository<Deposit>,
    private calculationsService: CalculationsService,
    ) {
        super(User);
    }

    async getUser(id: ID): Promise<User | undefined> {
        return await this.entityManager.findOne(User, id);
    }

    async getUserByIdentifier(body: UserIdentifierDto): Promise<User> {
        const identifier = body.identifier.toLowerCase().trim();

        return this.entityManager
            .createQueryBuilder(User, 'root')
            .leftJoinAndSelect('root.photo', 'photo')
            .leftJoinAndSelect('root.role', 'role')
            .where('root.email = :identifier', {
                identifier,
            })
            .getOne();
    }

    async uploadPhoto(id: ID, payload: any): Promise<FileDto> {
        const photo = await this.filesService.uploadFile(payload);

        try {
            await this.update(id, {
                photo,
            });
        } catch {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    errors: {
                        photo: 'failedSetPhoto',
                    },
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        return FileDto.create(photo);
    }

    async createUserByConfirm(body: CreateUserConfirmDto): Promise<void> {
        const { callback } = body;
        const referrer = body.referrerId && (await this.findByPartnerId(body.referrerId));
        await this.entityManager.transaction(async (entityManager) => {
            const user = entityManager.create(User, {
                ...body,
                referrerLevel: referrer?.level,
            } as DeepPartial<User>);

            await entityManager.save(user);
            await callback(user);
        });
    }

    async getReferrers(referrerId: string, depth: number) {
        let currentReferrerId = referrerId;

        const referrers: User[] = [];

        for (let i = 0; i < depth; ++i) {
            const user = await this.findByPartnerId(currentReferrerId);

            if (!user) {
                break;
            }

            referrers.push(user);

            if (!user.referrerId) {
                break;
            }

            currentReferrerId = user.referrerId;
        }

        return referrers;
    }

    async findByPartnerId(partnerId: string): Promise<User | undefined> {
        return this.entityManager.findOne(User, {
            partnerId,
        });
    }

    async getDepositAmountByUserId(userId: number) {
        let result = 0;
        const rows = await this.entityManager.query(
            `SELECT "currency_amount"
       FROM public.deposit
       WHERE "userId" = ${userId}`,
        );

        for (const row of rows) {
            result += +row.currency_amount;
        }
        return result;
    }

    async getReferrals(referrerId: string, requestDataArray?: RequestTeamStructureReferralsDto): Promise<GetReferralsUserFromCustomQuery[]> {
        const query = getTeamTreeQuery(referrerId, requestDataArray);
        const result: TeamTreeQueryItem[] = await this.entityManager.query(query);
        // console.log('result', result);
        return result.map<GetReferralsUserFromCustomQuery>(
            ({ deposit_amount, teamDeposit, level, ...other }) => ({
                level: +level,
                deposit_amount: +deposit_amount,
                teamDeposit: +teamDeposit,
                ...other,
            }),
        );
    }

    async getReferralsWithDepositAmount(
        referrerId: string,
    ): Promise<GetReferralsUserWithDepositAmountFromCustomQuery[]> {
        const query = getTeamTreeQueryWithDepositAmount(referrerId);
        const result: GetReferralsUserWithDepositAmountFromCustomQuery[] =
      await this.entityManager.query(query);
        return result.map<GetReferralsUserWithDepositAmountFromCustomQuery>(
            ({ deposit_amount, level, ...other }) => ({
                level: +level,
                deposit_amount: +deposit_amount,
                ...other,
            }),
        );
    }

    // async getReferrals(referrerId: string): Promise<User[]> {
    //   // this function can be optimized with plpgsql
    //   // const directReferrals = await this.entityManager.find(User, {
    //   //   where: {
    //   //     referrerId,
    //   //   },
    //   // });
    //   const queryResult = (await this.entityManager
    //     .createQueryBuilder(User, 'user')
    //     .select()
    //     .leftJoinAndSelect('user.team', 'team')
    //     .leftJoinAndSelect('user.deposits', 'deposits')
    //     .where('user.referrerId = :referrerId', { referrerId })
    //     .getMany()) as UserWithDepositAmount[];

    //   const directReferrals: UserWithDepositAmount[] = await Promise.all(
    //     queryResult.map(async (item) => {
    //       const amount = await this.getDepositAmountByUserId(item.id);
    //       item.deposit_amount = amount;
    //       return item;
    //     }),
    //   );
    //   // try {
    //   //   const hello = await this.entityManager
    //   //     .createQueryBuilder(User, 'user')
    //   //     .select()
    //   //     .leftJoinAndSelect('user.team', 'team')
    //   //     .where('user.referrerId = :referrerId', { referrerId })
    //   //     .getMany();
    //   //   console.log(hello);
    //   // } catch (error) {
    //   //   console.log(error);
    //   // }

    //   const indirectReferrals = (
    //     await Promise.all(directReferrals.map((user) => this.getReferrals(user.partnerId)))
    //   ).flat(1);

    //   return directReferrals.concat(indirectReferrals);
    // }

    async countReferrals(referrerId: string): Promise<number[]> {
        const result = Array.from({ length: 11 }, () => 0);

        const referrals = await this.getReferralsWithDepositAmount(referrerId);

        for (const referral of referrals) {
            if (referral.level === 0 && referral.deposit_amount === 0) {
                ++result[0];
            } else {
                ++result[referral.level + 1];
            }
        }

        return result;
    }

    filterChartsDataToOneDateValue(items: [Date, number][]) {
    // console.log(items);

        const result: {
      [key: string]: {
        time: string | number;
        value: number;
      };
    } = {};
        for (const item of items) {
            const [date, value] = item;

            const resultKey = `${date.getFullYear()}_${date.getMonth()}`;

            const resultValue = result[resultKey];
            const roundedValue = +value.toFixed(2);

            const displayedDate = new Date(new Date(date).setDate(1)).getTime();

            if (resultValue) {
                resultValue.value = +(roundedValue + resultValue.value).toFixed(2);
            } else {
                result[resultKey] = {
                    time: displayedDate,
                    value: roundedValue,
                };
            }
        }

        const resultItems = Object.values(result).map(({ time, value }) => [time, value]) as [
      number,
      number,
    ][];

        return resultItems.sort((a, b) => a[0] - b[0]);
    }

    // filterChartsDataToOneDateValue(items: [number, number][]) {
    //   console.log(items);

    //   const result = {};
    //   for (const item of items) {
    //     const [date, value] = item;

    //     const roundedValue = parseInt(value.toFixed(2));

    //     if (result[date]) {
    //       result[date] += roundedValue;
    //     } else {
    //       result[date] = roundedValue;
    //     }
    //   }
    //   const resultItems = Object.entries(result) as [string, number][];
    //   return resultItems
    //     .map(([date, value]): [number, number] => [parseInt(date), value])
    //     .sort((a, b) => a[0] - b[0]);
    // }

    async getIncomeToChartByDate(userId: number) {
        const dateMonthInterval = 6;
        const todayDate = new Date();
        const minusHalfYear = new Date(new Date().setMonth(todayDate.getMonth() - dateMonthInterval));
        const plusHalfYear = new Date(new Date().setMonth(todayDate.getMonth() + dateMonthInterval));

        const calculations: Calculation[] = await this.entityManager
            .createQueryBuilder(Calculation, 'calc')
            .select('*')
            .where('calc.payment_date >= :startDate', { startDate: minusHalfYear })
            .andWhere('calc.payment_date <= :endDate', { endDate: plusHalfYear })
            .andWhere('calc.userId = :userId', { userId })
            .getRawMany();

        const chartsData = calculations.map(({ payment_date, amount }) => {
            const item: [Date, number] = [payment_date, +amount];
            return item;
        });
        return chartsData;
    }

    async getIncome(user: User) {
        const earnBasicAmount =
      (
        (await this.entityManager
            .createQueryBuilder(Deposit, 'deposit')
            .leftJoinAndSelect(
                'deposit.calculations',
                'calculation',
                'calculation.status != :nulledStatus and calculation.status != :errorStatus and calculation.userId = :userId',
                {
                    nulledStatus: Status.nulled,
                    errorStatus: Status.error,
                    userId: user.id,
                },
            )
            .select('sum (calculation.amount) as earn_amount')
            .where('deposit.userId = :userId', { userId: user.id })
            .andWhere('product_service_description Like \'basic_\'')
            .getRawOne()) as { earn_amount: null | string }
      )?.earn_amount ?? 0;

        const currencyBasicAmount =
      (
        (await this.entityManager
            .createQueryBuilder(Deposit, 'deposit')
            .select('sum (deposit.currency_amount) as earn_amount')
            .where('deposit.userId = :userId', { userId: user.id })
            .andWhere('product_service_description Like \'basic_\'')
            .getRawOne()) as { earn_amount: null | string }
      )?.earn_amount ?? 0;
        console.log(earnBasicAmount, currencyBasicAmount);
        // console.log('fromBasic :>> ', fromBasic);

        const fromInvestor: { earn_amount: string | null } = await this.entityManager
            .createQueryBuilder(Deposit, 'deposit')
            .select('sum(earn_amount-currency_amount) as earn_amount')
            .where('deposit.userId = :userId', { userId: user.id })
            .andWhere('product_service_description Like \'investor_%\'')
            .andWhere('product_service_description not like \'investor_pro%\'')
            .getRawOne();

        const fromInvestorPro: { earn_amount: string | null } = await this.entityManager
            .createQueryBuilder(Deposit, 'deposit')
            .select('sum(earn_amount-currency_amount) as earn_amount')
            .where('deposit.userId = :userId', { userId: user.id })
            .andWhere('product_service_description Like \'investor_pro%\'')
            .getRawOne();

        const teamData = await this.entityManager.findOne(Team, {
            where: {
                user,
            },
        });

        const firstLineReferralsIncome = teamData.firstReferralsIncome;
        const otherLinesReferralsIncome = teamData.referralsIncome - teamData.firstReferralsIncome;

        const chartsData = await this.getIncomeToChartByDate(user.id);

        return {
            chartsData: this.filterChartsDataToOneDateValue(chartsData),
            partners: {
                firstLine: firstLineReferralsIncome, //+fromFirstLine[0].sum || 0,
                otherLines: otherLinesReferralsIncome, // +fromOtherLines[0].sum || 0,
            },
            products: {
                basic: +earnBasicAmount - +currencyBasicAmount,
                // basic: +fromBasic.earn_amount || 0,
                investor: +fromInvestor.earn_amount || 0,
                investorPro: +fromInvestorPro.earn_amount || 0,
            },
        };
    }

    async getTeamInfo(userId: number) {
        const user = await this.getUser(userId);

        const data = await this.entityManager.findOne(Team, {
            where: {
                user,
            },
        });

        const {
            firstDeposit,
            firstReferrals,
            firstReferralsIncome,
            referralsIncome,
            teamDeposit,
            totalReferrals,
        } = data;
        // const { referralsIncome } = await this.connection
        //   .getRepository(Accrual)
        //   .createQueryBuilder('accrual')
        //   .select('SUM(accrual.value)', 'referralsIncome')
        //   .where('accrual.targetUser IN (:...referrals)', {
        //     referrals: referrals.map(({ id }) => id),
        //   })
        //   .getRawOne<{ referralsIncome: number }>();

        // const { userIncome } = await this.connection
        //   .getRepository(Accrual)
        //   .createQueryBuilder('accrual')
        //   .select('SUM(accrual.value)', 'userIncome')
        //   .where('accrual.targetUser = :userId', {
        //     userId,
        //   })
        //   .getRawOne<{ userIncome: number }>();

        return {
            partnerId: user.partnerId,
            firstDeposit,
            firstReferrals,
            firstReferralsIncome,
            referralsIncome,
            teamDeposit,
            totalReferrals,
        };
    }

    async getPartnersIncome(userId: number, level: number, from: Date, to: Date) {
        const user = await this.getUser(userId);
        const referrals = await this.getReferrals(user.partnerId);
        let income = 0;

        if (referrals.length) {
            const query = this.connection
                .getRepository(Accrual)
                .createQueryBuilder('accrual')
                .select('SUM(accrual.value)', 'income')
                .leftJoin('user', 'user', 'user.id = accrual.targetUser')
                .where('accrual.targetUser IN (:...referrals)', {
                    referrals: referrals.map(({ id }) => id),
                })
                .andWhere('accrual.createdAt >= :from', { from })
                .andWhere('accrual.createdAt < :to', { to });

            if (level) {
                query.andWhere('user.level = :level', { level });
            }

            const response = await query.getRawOne<{ income: number }>();

            income = response.income;
        }

        // const res = {
        //     income: income ?? 0,
        //     referred: level ? referrals.filter((user) => user.level === level).length : referrals.length,
        // };

        return {
            income: income ?? 0,
            referred: level ? referrals.filter((user) => user.level === level).length : referrals.length,
        };
    }

    async createUser(body: CreateUserDto): Promise<User> {
        const user = this.entityManager.create(User, body as DeepPartial<User>);

        await this.entityManager.save(user);

        return user;
    }

    async setAgreement(userId: number, body: SetAgreementDto) {
        return this.entityManager.update(User, userId, { agreement: body.agreement });
    }

    async updateUser(id: ID, body: UpdateUserDto): Promise<User | undefined> {
        const user = await this.entityManager.findOne(User, id);

        if (!user) {
            return undefined;
        }

        // console.log(user);

        assign(user, body);
        // console.log(user, 'BEFORE SAVE');

        await this.entityManager.save(user);
        // console.log(user, 'AFTER SAVE');

        return user;
    }

    async getMaxLevelUser() {
        const userWithMaxLevel = await this.entityManager.query('SELECT MAX(level) FROM public.user');
        return userWithMaxLevel[0].max;
    }

    async getUserProfileData(user: User) {
        const userData = await this.entityManager.findOne(User, user.id, {
            relations: ['role'],
        }) as IUserDataWithRole;

        const partnerData = await this.entityManager
            .createQueryBuilder(User, 'user')
            .select()
            .where('"partnerId" = :partnerId', { partnerId: userData.referrerId })
            .getOne();


        const baseDepositLevel = await this.getCurrentBasePackage(user);
        const { needToAllStructure, needToFirstStructure } = await this.getToTheNextLevelData(
            user.id,
            userData.level,
        );
        return {
            baseDepositLevel,
            needToAllStructure,
            needToFirstStructure,
            ...new ReturnUserDto(userData),
            referrerName: partnerData?.fullName
        };
    }

    async getToTheNextLevelData(userId: number, userLevel: number) {
        try {
            const teamData = await this.entityManager
                .createQueryBuilder(Team, 'team')
                .select()
                .where('"userId" = :userId', { userId })
                .getOne();
            const [needToFirstStructure]: [string, number] = Object.entries(firstStructureLevels).find(
                ([, value]) => value === userLevel + 1,
            );
            const [needToAlLStructure] = Object.entries(allStructureLevels).find(
                ([, value]) => value === userLevel + 1,
            );
            if (!teamData) {
                return {
                    needToAllStructure: { percent: 0, value: +needToAlLStructure },
                    needToFirstStructure: { percent: 0, value: +needToFirstStructure },
                };
            }

            const firstDifference = +needToFirstStructure - +teamData.firstDeposit;
            const allDifference = +needToAlLStructure - +teamData.teamDeposit;
            const firstValue = {
                value: firstDifference > 0 ? firstDifference : 0,
                percent: firstDifference > 0 ? (+teamData.firstDeposit / +needToFirstStructure) * 100 : 100,
            };
            const allValue = {
                value: allDifference > 0 ? allDifference : 0,
                percent: allDifference > 0 ? (+teamData.teamDeposit / +needToAlLStructure) * 100 : 100,
            };
            return {
                needToAllStructure: allValue,
                needToFirstStructure: firstValue,
            };
        } catch (error) {
            return {
                needToAllStructure: { percent: 0, value: 0 },
                needToFirstStructure: { percent: 0, value: 0 },
            };
        }
    }

    async getCurrentBasePackage(user: User) {
        let baseDepositLevel = 0;
        const baseDeposits = await this.depositRepo.find({
            where: {
                user,
                product_service_description: Like('basic_'),
            },
        });

        for (const baseDeposit of baseDeposits) {
            const isDepositSended = await this.calculationsService.isDepositCalculationsSended(
                baseDeposit,
            );
            if (!isDepositSended || baseDeposit.status === DepositStatus.waiting_calculation) {
                const currentBaseDepositLevel = parseInt(
                    baseDeposit.product_service_description.replace('basic', ''),
                );
                baseDepositLevel = Math.max(currentBaseDepositLevel, baseDepositLevel);
            }
        }
        return baseDepositLevel;
    }

    async getUserStructure(user: User, requestedPartnerId: string, query: RequestTeamStructureReferralsDto): Promise<TeamUserStructure> {
        const userReferrals = await this.getReferrals(user.partnerId, query);
        const isUserHaveAccess = userReferrals.find((user) => user.partnerId === requestedPartnerId);
        if (!isUserHaveAccess) {
            throw new ForbiddenException();
        }
        const { partnerId, fullName, agreement } = await this.entityManager.findOne(User, {
            where: {
                partnerId: requestedPartnerId,
            },
        });
        if (+agreement !== 1) {
            throw new ForbiddenException();
        }
        const referrals = await this.getReferrals(partnerId, query);
        const teamInfo = await this.entityManager.findOne(Team, {
            where: {
                user: {
                    id: isUserHaveAccess.id,
                },
            },
        });
        return {
            partnerId,
            fullName,
            referrals,
            teamInfo: plainToInstance(TeamInfoDto, teamInfo, {
                excludeExtraneousValues: true,
            }),
        };
    }

    async getReferralsCount(user: User): Promise<ResponseReferralsCountDto> {
        const referralsCount =  (await this.entityManager.query(
            `
            with recursive referral as (
                select u.id, u."partnerId", u."referrerId", 0 as "refLevel"
                from "user" u
                where u."partnerId"=$1
                union all
                select u2.id, u2."partnerId", u2."referrerId", "refLevel" + 1 as "refLevel"
                from "user" as u2
                join referral rf on u2."referrerId"=rf."partnerId"
            ) select "refLevel" as level, coalesce(count(*), 0)::int as count from referral group by level order by level offset 1
          `,
            [user.partnerId],
        )) as ReferralCount[];
        return {
            referralsCount,
            referralsWithoutAnyDepositsCount: await this.countUsersReferralsTreeWithoutAnyDeposits(user)
        };
    }
    
    async countUsersReferralsTreeWithoutAnyDeposits(user: User): Promise<number> {
        const [{ result }] = (await this.entityManager.query(
            `
            select coalesce(count(*), 0)::int as result
            from
                (
                    select count(d)
                    from (
                             with recursive referral as (
                                 select u.id, u."partnerId", u."referrerId", 0 as "refLevel"
                                 from "user" u
                                 where u."partnerId"=$1
                                 union all
                                 select u2.id, u2."partnerId", u2."referrerId", "refLevel" + 1 as "refLevel"
                                 from "user" as u2
                                          join referral rf ON u2."referrerId"=rf."partnerId"
                             ) select rf.id from referral rf offset 1
                         ) as u
                    left outer join deposit d on u.id = d."userId"
                    group by u
                ) as res
          `,
            [user.partnerId],
        )) as QueryResult<number>;

        return result;
    }
}
