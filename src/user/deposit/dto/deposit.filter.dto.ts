import { IsOptional } from "class-validator";

export class DepositFilterDto {
    @IsOptional()
    date?: Date;

    @IsOptional()
    product?: string;

    @IsOptional()
    currency_amount?: number;

    @IsOptional()
    apy?: string;

    @IsOptional()
    investment_period?: string;

    @IsOptional()
    payment_period?: string;

    @IsOptional()
    earn_amount?: number;

    @IsOptional()
    wallet_addr?: string;

    @IsOptional()
    isClosed?: boolean;
}