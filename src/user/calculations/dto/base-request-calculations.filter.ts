import { IsEnum, IsOptional } from "class-validator";
import { Status } from "../calculations.types";
import { OptionalDateDto } from "./date.dto";

export class BaseRequestCalculationsFilter extends OptionalDateDto {
    @IsOptional()
    isClosed?: boolean

    @IsOptional()
    @IsEnum(Status)
    status?: Status
}