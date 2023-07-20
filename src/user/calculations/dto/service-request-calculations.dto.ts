import { BaseRequestCalculationsFilter } from "./base-request-calculations.filter";
import { BaseRequestCalculationsDto } from "./base-request-calculations.dto";
import { AccrualType } from "../calculations.types";
import { IsEnum } from "class-validator";

export class ServiceRequestCalculationsFilter extends BaseRequestCalculationsFilter {
    @IsEnum(AccrualType)
    accrual_type: AccrualType
}
export class ServiceRequestCalculationsDto extends BaseRequestCalculationsDto<'referralFullName' | 'referralPartnerId'> {
    filters: ServiceRequestCalculationsFilter
}