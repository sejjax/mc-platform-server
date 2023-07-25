import { JsonField } from "../../../utils/decorators/json-field.decorator";
import { RequestDataArray } from "../../../classes/request-data-array";
import { OptionalDateDto } from "./date.dto";
import { IsEnum, IsNumber, IsOptional } from "class-validator";
import { AccrualType, Status } from "../calculations.types";
import { OneMany } from "../../../utils/types/oneMany";
import { Order } from "../../../utils/types/order";
import { Id } from "../../deposit/deposit.types";

export class RequestDepositCalculationsFilter extends OptionalDateDto {
    @IsOptional()
    // TODO: Реализовать валидатор для типа OneMany<T> на декораторе @Type
    status?: OneMany<Status>

    @IsOptional()
    @IsNumber()
    productId?: Id
}

export class RequestDepositCalculationsOrderBy {
    @IsOptional()
    @IsEnum(Order)
    payment_date?: Order

    @IsOptional()
    @IsEnum(Order)
    wallet_addr: Order

    @IsOptional()
    @IsEnum(Order)
    amount: Order

    @IsOptional()
    @IsEnum(Order)
    percent: Order

    @IsOptional()
    @IsEnum(Order)
    accrual_type: Order

    @IsOptional()
    @IsEnum(Order)
    product: Order

    @IsOptional()
    @IsEnum(Order)
    status: Order
}

export class RequestDepositCalculationsDto extends RequestDataArray<RequestDepositCalculationsOrderBy> {
    @JsonField(RequestDepositCalculationsFilter)
    filters: RequestDepositCalculationsFilter

    @JsonField(RequestDepositCalculationsOrderBy)
    orderBy: RequestDepositCalculationsOrderBy
}