import { OneMany } from "../types/oneMany";
import { Enum } from "../types/enum";

type SqlPrimitive = string | boolean | number
export const isPrimitive = (val: any): val is SqlPrimitive => {
    return ['boolean', 'number', 'string'].includes(typeof val)
}
export const isEnum = (val: any): val is Enum => typeof val === 'object' && !Array.isArray(typeof val)
export const sqlString = (str: string) => `'${str}'`
export const sqlMapPrimitive = (val: SqlPrimitive): string => {
    if(typeof val === 'string')
        return sqlString(val)
    return val.toString()
}
export const sqlMap = (field: string, val?: OneMany<SqlPrimitive>): string => {
    if(val == null)
        return `true`
    if(isPrimitive(val))
        return `${field}=${sqlMapPrimitive(val)}`
    console.log(val)
    // @ts-ignore
    return `${field} in (${val.map(sqlMapPrimitive).join(', ')})`
}
