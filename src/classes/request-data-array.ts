import { Pagination } from "./pagination";
import { Filter } from "./filter";
import { JsonField } from "../utils/decorators/json-field.decorator";
import { Order } from "../utils/types/order";

export class RequestDataArray<T extends Filter, K extends string> {


    @JsonField()
    pagination: Pagination = new Pagination()
    @JsonField()
    filters: Partial<T> = {}
    @JsonField()
    orderBy: Partial<{[key in K]: Order}> = {}
}

