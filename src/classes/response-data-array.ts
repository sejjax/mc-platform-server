export class ResponseDataArray<T extends object> {
    items: T[]
    totalItemsCount: number
    totalPagesCount: number
    skip: number
    take: number
}