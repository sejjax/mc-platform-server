import { RequestDataArray } from "../../../classes/request-data-array";
import { DepositFilterDto } from "./deposit.filter.dto";

export class RequestDepositsDto extends RequestDataArray<DepositFilterDto, 'date'> {}


