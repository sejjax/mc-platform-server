import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { getRepository } from 'typeorm';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';

type ValidationEntity = { id?: number | string } | undefined;

@ValidatorConstraint({ name: 'IsNotExist', async: true })
export class IsNotExist implements ValidatorConstraintInterface {
  async validate(value: string, validationArguments: ValidationArguments) {
    const repository = validationArguments.constraints[0] as string;
    const currentValue = validationArguments.object as ValidationEntity;
    const pathToProperty = validationArguments.constraints[1];
    const entity = (await getRepository(repository).findOne({
      [pathToProperty ? pathToProperty : validationArguments.property]: pathToProperty
        ? value?.[pathToProperty]
        : value,
    })) as ValidationEntity;

    if (entity?.id === currentValue?.id) {
      return true;
    }

    return !entity;
  }
}
