import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserWithRefs } from 'src/metrics/metrics.types';
import { User } from 'src/users/user.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Deposit } from '../deposit/entities/deposit.entity';
import { AccrualType, CalculationPercentsFromLevel, CalculationWithByOrder, Status, } from './calculations.types';
import { CreateCalculationsDto } from './dto/create-calculations.dto';
import { Calculation } from './entities/calculation.entity';
import { ResponseIncomeForPeriodDto } from "./dto/response-income-for-period.dto";
import { dbFormat, epochStart, infinity, now } from "../../utils/helpers/date";
import { QueryResult } from "../../utils/types/queryResult";
import { RequestServiceCalculationsDto } from "./dto/service-request-calculations.dto";
import { dataArrayResponse } from "../../utils/helpers/dataArrayResponse";
import { ResponseDataArray } from "../../classes/response-data-array";
import { sqlCleanObjectQueryMap, sqlObjectQueryMap } from "../../utils/helpers/sqlObjectQueryMap";
import { clean } from "../../utils/helpers/clean";
import { Order } from "../../utils/types/order";
import { IsEnum, IsOptional } from "class-validator";
import { sqlMap } from "../../utils/helpers/sqlMap";
import { init1647911348140 } from "../../database/migrations/1647911348140-init";
import { sqlif } from "../../utils/helpers/sqlif";

@Injectable()
export class CalculationsService {
    constructor(
        @InjectRepository(Calculation)
        private calculationsRepo: Repository<Calculation>,
    ) {
    }

    async incomeForPeriod(user: User): Promise<ResponseIncomeForPeriodDto> {
        const [{
            currentWeekIncome,
            currentMonthIncome,
            nextMonthIncome
        }] = (await this.calculationsRepo.query(
            `
            select (
           select cast(coalesce(sum(c.amount), 0) as int)
           from "user" u  left outer join calculation c on u.id=c."userId"
           where c.payment_date between date_trunc('week', now()) and now() and c.accrual_type='product' and u.id=$1
       ) as "currentWeekIncome",
       (
           select cast(coalesce(sum(c.amount), 0) as int)
           from "user" u left outer join calculation c on u.id=c."userId"
           where c.payment_date between date_trunc('month', now()) and date_trunc('month', now()) + interval '1 month' and c.accrual_type='product' and u.id=$1

       ) as "currentMonthIncome",
       (
           select cast(coalesce(sum(c.amount), 0) as int)
           from "user" u left outer join calculation c on u.id=c."userId"
           where c.payment_date between date_trunc('month', now()) + interval '1 month' and date_trunc('month', now()) + interval '2 month' and c.accrual_type='product' and u.id=$1
       ) as "nextMonthIncome"`,
            [
                user.id,
            ],
        )) as [ResponseIncomeForPeriodDto];

        return {
            currentWeekIncome,
            currentMonthIncome,
            nextMonthIncome
        };
    }

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

    async getCalculationsByUser(user: User | UserWithRefs, query: RequestServiceCalculationsDto):
        Promise<
            ResponseDataArray<Calculation | CalculationWithByOrder> |
            Calculation | CalculationWithByOrder
        > {
        /* TODO: Test dates work */
        let {dateFrom, dateTo, productId, status, ...remainedFilers} = query.filters;

        const accrualType = query.filters.accrual_type;
        const {referralPartnerId, referralFullName, ...remainedOrderBy} = query.orderBy;
        const queryStart = () => this.calculationsRepo
            .createQueryBuilder('calculation')
            .leftJoinAndSelect('calculation.product', 'product')
            .leftJoinAndSelect('calculation.userPartner', 'userPartner')
            .where(`
            calculation.payment_date between :dateFrom and :dateTo  and calculation.userId=:userId
            `, {
                userId: user.id,
                dateFrom: typeof dateFrom === 'string' ? dateFrom : epochStart().toISOString(),
                dateTo: typeof dateTo === 'string' ? dateTo : infinity().toISOString(),
            })
            .andWhere(remainedFilers)
            .andWhere(sqlif(
                typeof status === 'string' || (Array.isArray(status) && status.length > 0),
                sqlMap('calculation.status', Array.isArray(status) ? status.map(it => it.toString()) : status)
            ))
            .andWhere(sqlif(typeof productId === "number", `product.id=${productId}`))
        const queryEnd = (dbQuery: SelectQueryBuilder<Calculation>) => dbQuery
            .orderBy(clean({
                ...sqlObjectQueryMap('calculation', remainedOrderBy),
                'userPartner.fullName': referralFullName,
                'userPartner.partnerId': referralPartnerId,
            }))
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
            .take(query.pagination.take)
            .skip(query.pagination.skip)
            .getManyAndCount();
        const [calculations, total] = await queryEnd(queryStart())


        let result;
        if (accrualType === AccrualType.product) {
            const ids: number[] = [];
            for (const calculation of calculations) {
                if (!ids.includes(calculation.product.id)) ids.push(calculation.product.id);
            }
            ids.sort();
            result = calculations.map<CalculationWithByOrder>((calculation) => ({
                ...calculation,
                buyOrder: ids.indexOf(calculation.product.id) + 1,
            }));
        } else {
            result = calculations
        }
        return dataArrayResponse({
            ...query.pagination,
            totalItemsCount: total,
            items: result
        });
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
