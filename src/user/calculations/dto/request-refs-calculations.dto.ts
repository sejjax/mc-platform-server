import { ServiceRequestCalculationsDto, ServiceRequestCalculationsFilter } from "./service-request-calculations.dto";

export class RequestRefsCalculationsFilter extends ServiceRequestCalculationsFilter {}

export class RequestRefsCalculationsDto extends ServiceRequestCalculationsDto {
    filters: RequestRefsCalculationsFilter
}