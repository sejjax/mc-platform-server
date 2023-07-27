import { IsDate } from 'class-validator';
import { Transform } from 'class-transformer';

export function DateField(): PropertyDecorator {
    /* Date from request must be provided in ISO format. */
    const fn = x => typeof x.value === 'string' ? new Date(x.value) : x.value;

    return function (target, propertyKey) {
        IsDate()(target, propertyKey);
        Transform(fn)(target, propertyKey);
    };
}