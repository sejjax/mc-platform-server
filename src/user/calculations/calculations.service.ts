import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserWithRefs } from 'src/metrics/metrics.types';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { Deposit } from '../deposit/entities/deposit.entity';
import { AccrualType, CalculationPercentsFromLevel, CalculationWithByOrder, Status, } from './calculations.types';
import { CreateCalculationsDto } from './dto/create-calculations.dto';
import { Calculation } from './entities/calculation.entity';
import { ResponseIncomeForPeriodDto } from "./dto/response-income-for-period.dto";
import { epochStart, infinity } from "../../utils/helpers/date";
import { RequestServiceCalculationsDto } from "./dto/service-request-calculations.dto";
import { dataArrayResponse } from "../../utils/helpers/dataArrayResponse";
import { ResponseDataArray } from "../../classes/response-data-array";
import { sqlCleanObjectQueryMap } from "../../utils/helpers/sqlObjectQueryMap";
import { sqlMap } from "../../utils/helpers/sqlMap";
import { all, comma, o, orderBy } from "../../utils/helpers/sql";
import { transferObjectFields } from "../../helpers/transferObjectFields";
import { omit } from "../../utils/helpers/object";
import { Transaction } from "../../transactions/transaction.entity";
import { formatString } from "../../helpers/formatString";
import { mergeCalculationsWithProjects } from "../deposit/helpers/mergeCalculationsWithProjects";
import { Product } from "../product/product.entity";
import { ProductService } from "../product/product.service";
import { HttpModule } from "@nestjs/axios";
import { isEmpty } from "../../helpers/isEmpty";
import { absentLocalesCheck } from "../deposit/helpers/absentLocalesCheck";
import { absentLocalesError } from "../deposit/helpers/absentLocalesError";


@Injectable()
export class CalculationsService {
    private readonly productService: ProductService
    constructor(
        @InjectRepository(Calculation)
        private calculationsRepo: Repository<Calculation>,
        // import http service
        // сделать функции хелпером
        // сделать хоть как-то
    ) {
        this.productService = new ProductService()
    }

    async incomeForPeriod(user: User): Promise<ResponseIncomeForPeriodDto> {
        const [{
            currentWeekIncome,
            currentMonthIncome,
            nextMonthIncome
        }] = (await this.calculationsRepo.query(
            `
            select (
           select cast(coalesce(sum(c.amount), 0) as float)
           from "user" u  left outer join calculation c on u.id=c."userId"
           where c.payment_date between date_trunc('week', now()) and now() and c.accrual_type='product' and u.id=$1
       ) as "currentWeekIncome",
       (
           select cast(coalesce(sum(c.amount), 0) as float)
           from "user" u left outer join calculation c on u.id=c."userId"
           where c.payment_date between date_trunc('month', now()) and date_trunc('month', now()) + interval '1 month' and c.accrual_type='product' and u.id=$1

       ) as "currentMonthIncome",
       (
           select cast(coalesce(sum(c.amount), 0) as float)
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
        const {productId, status, ...remainedFilers} = query.filters;
        const dateFrom = typeof query.filters.dateFrom === 'string' ? query.filters.dateFrom : epochStart().toISOString()
        const dateTo = typeof query.filters.dateTo === 'string' ? query.filters.dateTo : infinity().toISOString()

        delete remainedFilers.dateFrom;
        delete remainedFilers.dateTo;

        const accrualType = query.filters.accrual_type;
        const {referralPartnerId, referralFullName, product, percent, ...remainedOrderBy} = query.orderBy;


        const buildSqlQuery = (cond: boolean) => `
                select ${cond ? `count(*)` : `
                    c.accrual_type,
                    c.id,
                    c.amount,
                    c.payment_date,
                    d.product,
                    d.id as "productId",
                    t.id as "transactionId",
                    c.status,
                    c.wallet_addr,
                    c.percent,
                    up."fullName",
                    up."partnerId",
                    d.product_service_description
                    `}
                from calculation c
                left outer join deposit d on c."productId" = d.id
                left outer join "transaction" t on d."transactionId" = t.id
                left outer join "user" u on c."userId" = u.id
                left outer join "user" up on c."userPartnerId" = up.id
                where
                    ${all(
                'true',
                'u.id=$userId',
                o(dateFrom, () => `c.payment_date > '${dateFrom}'`),
                o(dateTo, () => `c.payment_date < '${dateTo}'`),
                o(productId, () => `"productId"=${productId}`),
                o(status, () => sqlMap(`c.status`, Array.isArray(status) ? status.map(it => it.toString()) : []), Array.isArray(status)),
                ...Object.entries(sqlCleanObjectQueryMap('c', remainedFilers)).map(([key, value]) => `${key}='${value}'`)
        )}
                ${!cond ? `order by ${comma(
                orderBy('c', remainedOrderBy),
                o(percent, () => `c.percent::float ${percent}`),
                o(referralFullName, () => `up."fullName" ${referralFullName}`),
                o(referralPartnerId, () => `up."partnerId" ${referralPartnerId}`),
                o(product, () => `d.id ${product}`),
                'c.id',
        )}
                offset $skip
                limit $take` : ''}
        `
        const sqlQueryTotal = formatString(buildSqlQuery(true), {userId: user.id})
        const sqlQuery = formatString(buildSqlQuery(false), {
            userId: user.id,
            skip: query.pagination.skip,
            take: query.pagination.take,
        })

        const totalRes = await this.calculationsRepo.query(sqlQueryTotal) as ({ count: string })[];
        const total = Number(totalRes[0].count);

        let calculations = await this.calculationsRepo.query(sqlQuery) as any[];
        calculations = calculations.map(it => {
            const calc = new Calculation();
            transferObjectFields(omit(it, ['fullName', 'partnerId', "productId", "transactionId"]), calc)
            calc.product = new Deposit()
            calc.product.id = it.productId
            calc.product.product = it.product
            calc.product.product_service_description = it.product_service_description
            calc.product.transaction = new Transaction()
            calc.product.transaction.id = it.transactionId
            calc.product.generateGUID()
            delete calc.product.transaction

            calc.userPartner = new User()

            calc.userPartner.fullName = it.fullName
            calc.userPartner.partnerId = it.partnerId
            return calc
        }) as Calculation[]
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
        } else  result = calculations


        // const projects = await this.projectsService.getAllProjects()
        let projects = await this.productService.fetchProjects(query.locale)

        const absentLocales = absentLocalesCheck(calculations.map(calc => calc.product), projects, query.locale)
        if(absentLocales)
            console.log(absentLocalesError(absentLocales))
        const finalResult = mergeCalculationsWithProjects(result, projects)

        return dataArrayResponse({
            ...query.pagination,
            totalItemsCount: total,
            items: finalResult
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
