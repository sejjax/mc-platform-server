import { IsOptional } from "class-validator";
import { DateField } from "../../../decorators/dateField";

export class OptionalDateDto {
    @IsOptional()
    @DateField()
    dateFrom: Date

    @DateField()
    @IsOptional()
    dateTo: Date
}