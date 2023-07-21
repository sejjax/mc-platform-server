import { RequestDataArray } from "../../../classes/request-data-array";
import { DepositFilterDto } from "./deposit.filter.dto";
import { IsOptional, ValidateNested } from "class-validator";
import { JsonField } from "../../../utils/decorators/json-field.decorator";
import { Type } from "class-transformer";

export class RequestDepositsDto extends RequestDataArray<
    DepositFilterDto,
    'date' | 'product' | 'currency_amount' | 'apy' | 'investment_period' |
    'payment_period' | 'earn_amount' | 'wallet_addr'
> {


    @JsonField()
    @Type(() => DepositFilterDto)
    @ValidateNested()

    filters!: DepositFilterDto
}


