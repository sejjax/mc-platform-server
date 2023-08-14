import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Deposit } from 'src/user/deposit/entities/deposit.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { Id, InvestorProDepositAmountReponse } from './deposit.types';
import { GetInvestmentSummaryDto } from './dto/get-investment-summary.dto';
import { depositIdFromGuid } from './helpers/depositIdFromGuid';
import { RequestDepositDto } from './dto/request-deposits.dto';
import { isGuid } from './helpers/isGuid';
import { epochStart, infinity } from '../../utils/helpers/date';
import { ResponseDataArray } from '../../classes/response-data-array';
import { dataArrayResponse } from '../../utils/helpers/dataArrayResponse';
import { clean } from '../../utils/helpers/clean';
import { sqlObjectQueryMap } from '../../utils/helpers/sqlObjectQueryMap';
import { ProductService } from '../product/product.service';
import { absentLocalesCheck } from './helpers/absentLocalesCheck';
import { absentLocalesError } from './helpers/absentLocalesError';
import { mergeDepositsWithProjects } from './helpers/mergeDepositsWithProjects';
import { omit } from '../../utils/helpers/object';
import { InvestmentInfoDto } from 'src/user/deposit/dto/investment-info.dto';

@Injectable()
export class DepositService {
    private readonly productService: ProductService;
    constructor(
        @InjectRepository(Deposit)
        private depositRepo: Repository<Deposit>,
    ) {
        this.productService = new ProductService();
    }

    async findById(id: Id): Promise<Deposit | undefined> {
        return this.depositRepo.findOne(id);
    }

    async findByUser(user: User, {
        pagination,
        filters,
        orderBy,
        locale
    }: RequestDepositDto, idOrGuid?: string): Promise<ResponseDataArray<Deposit> | Deposit> {
        let id = undefined;
        if (idOrGuid != null && isGuid(idOrGuid))
            id = depositIdFromGuid(idOrGuid);
        else if (idOrGuid != null)
            id = Number(idOrGuid);

        if (id != null)
            return await this.depositRepo.findOne(id);

        const {dateFrom, dateTo, ...remainedFilters} = filters;
        // TODO: Check dates working

        // const {product, ...remainedOrderBy} = orderBy;
        const remainedOrderBy = omit(orderBy, ['product']);
        const [result, total] = await this.depositRepo
            .createQueryBuilder('d')
            .where({user, ...clean(remainedFilters)})
            .andWhere(`
                d.date between :dateFrom and :dateTo
                `, {
                dateFrom: typeof dateFrom === 'string' ? dateFrom : epochStart().toISOString(),
                dateTo: typeof dateTo === 'string' ? dateTo : infinity().toISOString(),
            })
            .orderBy(clean({
                ...sqlObjectQueryMap('deposit', remainedOrderBy),
                // TODO: Add product orderBy
            }))
            .skip(pagination.skip)
            .take(pagination.take)
            .getManyAndCount();

        const projects = await this.productService.fetchProjects(locale);

        const absentLocales = absentLocalesCheck(result, projects, locale);
        if(absentLocales)
            console.log(absentLocalesError(absentLocales));
        const finalResult = mergeDepositsWithProjects(result, projects);

        return dataArrayResponse({
            ...pagination,
            totalItemsCount: total,
            items: finalResult
        });
    }

    async getInvestorProAmountByUser(userId: number): Promise<InvestorProDepositAmountReponse> {
        const [{sum: allPackages}] = (await this.depositRepo.query(
            'select cast(coalesce(sum(d.currency_amount),0)as float) as sum from "public".deposit d where d.product_service_description like \'investor_pro%\' and d.product_service_description != \'investor_pro_gamefi\'',
        )) as [{ sum: number }];

        const [{sum: perUser}] = (await this.depositRepo.query(
            'select cast(coalesce(sum(d.currency_amount),0)as float) as sum from "public".deposit d where d.product_service_description like \'investor_pro%\' and d.product_service_description != \'investor_pro_gamefi\' and d."userId" = $1',
            [userId],
        )) as [{ sum: number }];

        return {allPackages, perUser};
    }

    async investmentSummary(user: User): Promise<GetInvestmentSummaryDto> {
        const [{
            currentInvestmentAmount,
            totalPayedAmount,
            totalInvestedAmount,
            payReadyAmount
        }] = await this.depositRepo.query(
            `
            select (
              select cast(coalesce(sum(d.currency_amount), 0) as float)
              from "user" u 
              left outer join deposit d on u.id=d."userId" 
              where d.status='calculated' and now() < d."date" + interval '1 week' * cast(d.ip_wks as int) and u.id=$1
            ) as "currentInvestmentAmount",
            (
              select cast(coalesce(sum(wh.currency_amount), 0) as float)
              from "user" u 
              left outer join withdraw_history wh on u.id=wh."userId" 
              where u.id=$1
            ) as "totalPayedAmount",
            (
              select cast(coalesce(sum(d.currency_amount), 0) as float)
              from "user" u 
              left outer join deposit d on u.id=d."userId" 
              where d.status='calculated' and u.id=$1
            ) as "totalInvestedAmount",
            (
              select cast(coalesce(b.available_to_withdraw_balance, 0) as int)
              from "user" u 
              left outer join balance b on u.id=b."userId" 
              where u.id=$1
            ) as "payReadyAmount"`,
            [user.id]
        ) as [GetInvestmentSummaryDto];
        return {
            currentInvestmentAmount,
            totalPayedAmount,
            totalInvestedAmount,
            payReadyAmount
        };
    }

    async investmentInfo(user: User): Promise<InvestmentInfoDto> {
        const [{
            totalInvestments,
            currentInvestments,
            totalIncome,
            totalInvestmentsReturn,
            totalPayed,
            futureIncome,
            futureInvestmentsReturn,
            futurePayed,
            finalProfit
        }] = await this.depositRepo.query(
            `
                select (
                    select sum(d.currency_amount)
                    from "deposit" d
                    where d."userId" = $1
                ) as "totalInvestments",
                (
                    select sum(d.currency_amount)
                    from "deposit" d
                    where d."userId" = $1 and not d."isClosed"
                ) as "currentInvestments",
                (
                    select coalesce(sum(c.amount), 0)
                    from "calculation" c
                    where c."userId" = $1 and c."payment_date" < now() and c."status" != 'nulled'
                ) as "totalIncome",
                (
                    select coalesce(sum(c.amount), 0)
                    from "calculation" c
                    left join deposit d on c."productId" = d."id"
                    where c."userId" = $1 and d."isClosed" and c."status" != 'nulled'
                ) as "totalInvestmentsReturn",
                (
                    select (
                        (
                            select coalesce(sum(c.amount), 0)
                            from "calculation" c
                            where c."userId" = $1 and c."payment_date" < now() and c."status" != 'nulled'
                        )
                        +
                        (
                            select coalesce(sum(c.amount), 0)
                            from "calculation" c
                            left join deposit d on c."productId" = d."id"
                            where c."userId" = $1 and d."isClosed" and c."status" != 'nulled'
                        )
                    )
                ) as "totalPayed",
                (
                    select coalesce(sum(c.amount), 0)
                    from "calculation" c
                    where c."userId" = $1 and c."status" = 'waiting'
                ) as "futureIncome",
                (
                    select greatest(0, sum(
                        d.currency_amount -
                        (
                            select coalesce(sum(c.amount), 0)
                            from "calculation" c
                            where c."productId" = d."id" and c.status != 'nulled'
                        )
                    ))
                    from "deposit" d
                    where d."userId" = $1
                ) as "futureInvestmentsReturn",
                (
                    select (
                        (
                            select coalesce(sum(c.amount), 0)
                            from "calculation" c
                            where c."userId" = $1 and c."status" = 'waiting'
                        )
                        +
                        (
                            select greatest(0, sum(
                                d.currency_amount -
                                (
                                    select coalesce(sum(c.amount), 0)
                                    from "calculation" c
                                    where c."productId" = d."id" and c.status != 'nulled'
                                )
                            ))
                            from "deposit" d
                            where d."userId" = $1
                        )
                    )
                ) as "futurePayed",
                (
                    select sum(greatest(0, d.earn_amount - d.currency_amount))
                    from "deposit" d
                    where d."userId" = $1
                ) as "finalProfit"
            `, [user.id]);

        const graphicData = await this.depositRepo.query(`
            select c."payment_date" as "date",
                   (
                       select coalesce(sum(d."currency_amount"), 0)
                       from deposit d
                       where d."id" = c."productId"
                   ) as "inInvesting",
                   (
                       select coalesce(sum(c1."amount"), 0)
                       from calculation c1
                       where c."productId" = c1."productId" and c."payment_date" <= c1."payment_date"
                   ) as "payed"
            from calculation c
            join deposit d on c."productId" = d."id"
            where c."userId" = $1 and c."status" != 'nulled' and d."date" < c."payment_date"
            order by "date"
        `, [user.id]);

        return {
            totalInvestments,
            currentInvestments,
            totalIncome,
            totalInvestmentsReturn,
            totalPayed,
            futureIncome,
            futureInvestmentsReturn,
            futurePayed,
            finalProfit,
            graphicData
        };
    }
}
