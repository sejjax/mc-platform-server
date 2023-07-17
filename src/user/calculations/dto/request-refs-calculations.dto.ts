import { IsEnum, IsNotEmpty } from "class-validator";
import { AccrualType } from "../calculations.types";
import { OptionalDateDto } from "./date.dto";

export class RequestRefsCalculationsDto extends OptionalDateDto {
    @IsNotEmpty()
    @IsEnum(AccrualType)
    referralType: AccrualType
}