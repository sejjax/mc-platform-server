import { ObjectLiteral, Repository, SelectQueryBuilder } from "typeorm";
import { RequestDataArray } from "../../classes/request-data-array";
import { sqlCleanObjectQueryMap } from "./sqlObjectQueryMap";

export const all = (...args: string[]) => args.join(' and ')
export const any = (...args: string[]) => args.join(' or ')

export type SelectQueryBuilderFn<T> = (query: SelectQueryBuilder<T>) => SelectQueryBuilder<T>

export const dataArrayQuery = async <T extends ObjectLiteral>(
    repo: Repository<T>,
    alias: string,
    {pagination, orderBy, filters}: RequestDataArray,
    queryMiddle: SelectQueryBuilderFn<T> = (query) => query,
): Promise<[T[], number]> => {
    const _queryEnd = (query: SelectQueryBuilder<T>) => query
        .orderBy(sqlCleanObjectQueryMap(alias, orderBy))
        .skip(pagination.skip)
        .take(pagination.take);

    return await _queryEnd(queryMiddle(repo.createQueryBuilder(alias)).andWhere(sqlCleanObjectQueryMap(alias, filters))).getManyAndCount()
}