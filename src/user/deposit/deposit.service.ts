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
import {InvestmentDataDto} from 'src/user/deposit/dto/investment-data.dto';

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

    async investmentData(user: User): Promise<InvestmentDataDto[]> {
        return await this.depositRepo.query(
            `
                select d."date", cast(coalesce(d."currency_amount", 0) as float) as "inInvesting", cast(coalesce(d."earn_amount", 0) as float) as "payed"
                from "user" u
                left join deposit d on u."id" = d."userId"
                where u."id" = $1
            `, [user.id]
        );
    }
}
