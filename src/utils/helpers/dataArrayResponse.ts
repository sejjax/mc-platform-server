import { ResponseDataArray } from "../../classes/response-data-array";

export const dataArrayResponse = <T extends object>(obj: {skip: number, take: number, totalItemsCount: number, items}): ResponseDataArray<T> => ({
    ...obj,
    totalPagesCount: Math.ceil(obj.totalItemsCount / obj.take)
})