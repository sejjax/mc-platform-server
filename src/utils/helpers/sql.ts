import { ObjectLiteral, Repository, SelectQueryBuilder } from "typeorm";
import { RequestDataArray } from "../../classes/request-data-array";
import { sqlCleanObjectQueryMap, sqlObjectQueryMap } from "./sqlObjectQueryMap";

export const o = <T extends any>(args: T, query: (args: T) => string, cond: boolean=args != null) =>
    cond ? query(args) : '';

export const strclean = (strings: string[]) => strings.filter(str => str !== '')
export const all = (...args: string[]) => strclean(args).join(' and ')
export const any = (...args: string[]) => strclean(args).join(' or ')
export const comma = (...args: string[]) => strclean(args).join(', ')

export const orderBy = (field: string, obj: object) => comma(
    ...Object.entries(sqlCleanObjectQueryMap(field, obj)).map(([key, value]) => `${key} ${value}`)
)