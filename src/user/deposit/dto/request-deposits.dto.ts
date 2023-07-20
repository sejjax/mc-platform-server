import { RequestDataArray } from "../../../classes/request-data-array";
import { DepositFilterDto } from "./deposit.filter.dto";

export class RequestDepositsDto extends RequestDataArray<
    DepositFilterDto,
    'date' | 'product' | 'currency_amount' | 'apy' | 'investment_period' |
    'payment_period' | 'earn_amount' | 'wallet_addr'
> {}


