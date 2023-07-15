import { IsEnum, IsNotEmpty } from "class-validator";
import { AccrualType } from "../calculations.types";

export class RequestRefsCalculationsDto {
    @IsNotEmpty()
    @IsEnum(AccrualType)
    referralType: AccrualType
}