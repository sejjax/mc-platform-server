import { JsonField } from "../../../utils/decorators/json-field.decorator";
import { RequestDataArray } from "../../../classes/request-data-array";
import { OptionalDateDto } from "../../calculations/dto/date.dto";
import { IsBoolean, IsEnum, IsOptional } from "class-validator";
import { Order } from "../../../utils/types/order";


export class RequestDepositFilter extends OptionalDateDto {
    @IsOptional()
    @IsBoolean()
    isClosed?: boolean
}

export class RequestDepositOrderBy {
    @IsEnum(Order)
    @IsOptional()
    date?: Order

    @IsEnum(Order)
    @IsOptional()
    product?: Order

    @IsEnum(Order)
    @IsOptional()
    currency_amount?: Order

    @IsEnum(Order)
    @IsOptional()
    apy?: Order

    @IsEnum(Order)
    @IsOptional()
    investment_period?: Order

    @IsEnum(Order)
    @IsOptional()
    payment_period ?: Order

    @IsEnum(Order)
    @IsOptional()
    earn_amount?: Order

    @IsEnum(Order)
    @IsOptional()
    wallet_addr?: Order
}

export class RequestDepositDto extends RequestDataArray<RequestDepositOrderBy> {
    @JsonField(RequestDepositFilter)
    filters: RequestDepositFilter

    @JsonField(RequestDepositOrderBy)
    orderBy: RequestDepositOrderBy
}