import { RequestDataArray } from "../../../classes/request-data-array";
import { BaseRequestCalculationsFilter } from "./base-request-calculations.filter";
import { JsonField } from "../../../utils/decorators/json-field.decorator";
import { ValidateNested } from "class-validator";

export class BaseRequestCalculationsDto<T extends string = undefined> extends RequestDataArray<
    BaseRequestCalculationsFilter,
    Exclude<'payment_date' | 'wallet_addr' |
    'amount' | 'percent' | 'accrual_type' | 'product' | 'status' | T, undefined>
> {
    @ValidateNested()
    @JsonField()
    filters: BaseRequestCalculationsFilter
}