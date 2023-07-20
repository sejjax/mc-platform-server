import { RequestDataArray } from "../../../classes/request-data-array";
import { BaseRequestCalculationsFilter } from "./base-request-calculations.filter";

export class BaseRequestCalculationsDto<T extends string = undefined> extends RequestDataArray<
    BaseRequestCalculationsFilter,
    Exclude<'payment_date' | 'wallet_addr' |
    'amount' | 'percent' | 'accrual_type' | 'product' | 'status' | T, undefined>
> {
    filters: BaseRequestCalculationsFilter
}