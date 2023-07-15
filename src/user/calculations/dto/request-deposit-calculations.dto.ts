import { IsOptional, IsDate} from "class-validator";
import { epochStart, now } from "../../../helpers/date";

export class RequestDepositCalculationsDto {
    @IsOptional()
    @IsDate()
    dateFrom: Date = epochStart();

    @IsDate()
    @IsOptional()
    dateTo: Date = now();
}