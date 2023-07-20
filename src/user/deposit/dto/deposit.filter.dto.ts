import { IsOptional } from "class-validator";

export class DepositFilterDto {
    @IsOptional()
    isClosed?: boolean;
}