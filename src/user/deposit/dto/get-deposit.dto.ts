import {Deposit} from "../entities/deposit.entity";
import {Expose} from "class-transformer";

export class GetDepositDto extends Deposit {
    @Expose() relativeId: number;
}
