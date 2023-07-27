import { IsObject } from 'class-validator';
import { Transform } from 'class-transformer';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidateNested } from './validate-nested.decorator';

export function JsonField(schema?: new () => any): PropertyDecorator {
    /* Date from request must be provided in ISO format. */
    /* TODO: Implement multiple inheritance checking */
    const fn = obj => {
        try {
            return JSON.parse(obj.value);
        } catch (e) {
            throw new HttpException('Invalid json', HttpStatus.UNPROCESSABLE_ENTITY);
        }
    };

    return function (target, propertyKey) {
        Transform(fn)(target, propertyKey);
        IsObject()(target, propertyKey);
        if(schema == null) return;
        ValidateNested(schema)(target, propertyKey);
    };
}