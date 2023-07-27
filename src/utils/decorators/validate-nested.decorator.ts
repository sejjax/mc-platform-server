import { registerDecorator, validateSync, ValidationOptions } from 'class-validator';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';
import { plainToClass } from 'class-transformer';

export function ValidateNested(
    schema: new () => any,
    validationOptions?: ValidationOptions
) {

    return function (object: object, propertyName: string | symbol) {
        registerDecorator({
            name: 'ValidateNested',
            target: object.constructor,
            propertyName: propertyName.toString(),
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    args.value;
                    if (Array.isArray(value)) {
                        for (let i = 0; i < (<Array<any>>value).length; i++) {
                            if (validateSync(plainToClass(schema, value[i])).length) {
                                return false;
                            }
                        }
                        return true;
                    } else return !validateSync(plainToClass(schema, value)).length;
                },
                defaultMessage(args) {
                    if (Array.isArray(args.value)) {
                        for (let i = 0; i < (<Array<any>>args.value).length; i++) {
                            return (
                                `${args.property}::index${i} -> ` +
                                validateSync(plainToClass(schema, args.value[i]))
                                    .map((e) => e.constraints)
                                    .reduce((acc, next) => acc.concat(Object.values(next)), [])
                            ).toString();
                        }
                    } else return (
                        `${args.property}: ` +
                        validateSync(plainToClass(schema, args.value))
                            .map((e) => e.constraints)
                            .reduce((acc, next) => acc.concat(Object.values(next)), [])
                    ).toString();
                },
            },
        });
    };
}