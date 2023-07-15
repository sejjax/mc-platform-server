import { IsOptional, IsDate} from "class-validator";

export class RequestDepositCalculationsDto {
    @IsOptional()
    @IsDate()
    dateFrom: Date = new Date(0); // По дефолту дата начала - это дата начала эпохи

    @IsDate()
    @IsOptional()
    dateTo: Date = new Date(); // По дефолту дата конца - текущая дата
}