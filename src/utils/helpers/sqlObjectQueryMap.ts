import { clean } from "./clean";

export const sqlObjectQueryMap = (field: string, obj: object) => {
    return Object.fromEntries(Object.entries(obj).map(([key, value]) => ([
        `${field}.${key}`,
        value
    ])))
}

export const sqlCleanObjectQueryMap = (field: string, obj: object) => clean(sqlObjectQueryMap(field, obj))