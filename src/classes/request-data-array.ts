import { Pagination } from './pagination';
import { Filter } from './filter';
import { JsonField } from '../utils/decorators/json-field.decorator';
import { IsOptional } from 'class-validator';

export abstract class RequestDataArray<T> {
    @JsonField(Pagination)
    @IsOptional()
    pagination: Pagination = new Pagination();

    /* You need to apply @JsonField() in your class on this field to convert json to object */
    @IsOptional()
    filters: Filter = {};

    /* You need to apply @JsonField() in your class on this field to convert json to object */
    /* TODO: Implement type for orderBy field. Problem: class is not assignable to {[key in string]: Order}  */
    @IsOptional()
    orderBy: Partial<{ [key in keyof T]?: string | symbol }> = {};
}
