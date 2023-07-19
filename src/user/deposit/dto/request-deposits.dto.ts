import { RequestDataArray } from "../../../classes/request-data-array";
import { DepositFilterDto } from "./deposit.filter.dto";
import { IsEnum } from "class-validator";
import { Order } from "../../../utils/types/order";

class OrderByDate {
    @IsEnum(Order)
    date: Order
}
export class RequestDepositsDto extends RequestDataArray<DepositFilterDto, 'date'> {
    orderBy: OrderByDate
}


