import { IsOptional, IsDate} from "class-validator";

export class RequestIncomeForPeriodDto {
    @IsOptional()
    @IsDate()
    dateFrom: Date

    @IsDate()
    @IsOptional()
    dateTo: Date
}