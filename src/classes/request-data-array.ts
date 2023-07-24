import { Pagination } from "./pagination";
import { Filter } from "./filter";
import { JsonField } from "../utils/decorators/json-field.decorator";
import { Order } from "../utils/types/order";
import { IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

    export abstract class RequestDataArray {
        @JsonField(Pagination)
        @IsOptional()
        pagination: Pagination = new Pagination()

        /* You need to apply @JsonField() in your class on this field to convert json to object */
        @IsOptional()
        filters: Filter = {}

        /* You need to apply @JsonField() in your class on this field to convert json to object */
        @IsOptional()
        /* TODO: Implement type for orderBy field. Problem: class is not assignable to {[key in string]: Order}  */
        orderBy: any = {}
    }
