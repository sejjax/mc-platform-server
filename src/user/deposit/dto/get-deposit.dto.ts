import {Deposit} from "../entities/deposit.entity";
import {Expose} from "class-transformer";

export class GetDepositDto extends Deposit {
    relativeId: number;
    isClosed: boolean;
}
