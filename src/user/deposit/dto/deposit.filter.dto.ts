import { IsOptional } from "class-validator";
import { OptionalDateDto } from "../../calculations/dto/date.dto";

export class DepositFilterDto extends OptionalDateDto {
    @IsOptional()
    isClosed?: boolean;
}