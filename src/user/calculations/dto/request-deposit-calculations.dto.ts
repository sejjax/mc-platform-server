import { IsOptional, IsDate} from "class-validator";

export class RequestDepositCalculationsDto {
    @IsOptional()
    @IsDate()
    dateFrom: Date

    @IsDate()
    @IsOptional()
    dateTo: Date
}