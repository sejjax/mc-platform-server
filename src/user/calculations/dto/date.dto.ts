import { IsOptional } from "class-validator";
import { DateField } from "../../../utils/decorators/date-field.decorator";

export class OptionalDateDto {
    @IsOptional()
    @DateField()
    dateFrom: Date

    @DateField()
    @IsOptional()
    dateTo: Date
}