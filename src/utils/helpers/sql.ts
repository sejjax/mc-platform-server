import { sqlCleanObjectQueryMap } from './sqlObjectQueryMap';

export const o = <T>(args: T, query: (args: T) => string, cond: boolean=args != null) =>
    cond ? query(args) : '';

export const strclean = (strings: string[]) => strings.filter(str => str !== '');
export const all = (...args: string[]) => strclean(args).join(' and ');
export const any = (...args: string[]) => strclean(args).join(' or ');
export const comma = (...args: string[]) => strclean(args).join(', ');

export const orderBy = (field: string, obj: object) => comma(
    ...Object.entries(sqlCleanObjectQueryMap(field, obj)).map(([key, value]) => `${key} ${value}`)
);