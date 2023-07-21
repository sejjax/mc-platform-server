import { IsEnum, IsOptional } from "class-validator";
import { Status } from "../calculations.types";
import { OptionalDateDto } from "./date.dto";
import { Id } from "../../deposit/deposit.types";

export class BaseRequestCalculationsFilter extends OptionalDateDto {
    @IsOptional()
    @IsEnum(Status)
    status?: Status

    @IsOptional()
    productId: Id
}