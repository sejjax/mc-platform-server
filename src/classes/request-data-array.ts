import { Pagination } from "./pagination";
import { Filter } from "./filter";
import { JsonField } from "../utils/decorators/json-field.decorator";
import { Order } from "../utils/types/order";
import { IsOptional } from "class-validator";

export class RequestDataArray<T extends Filter, K extends string> {

    @IsOptional()
    @JsonField()
    pagination: Pagination = new Pagination()

    @IsOptional()
    filters: Partial<T> = {}

    @IsOptional()
    @JsonField()
    orderBy: Partial<{[key in K]: Order}> = {}
}

