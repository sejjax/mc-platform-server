import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isDefined, isEnum } from 'class-validator';

@Injectable()
export class EnumValidationPipe implements PipeTransform<string, Promise<any>> {
  constructor(private enumEntity: any) {}
  transform(value: string): any {
    if (isDefined(value) && isEnum(value, this.enumEntity)) {
      return this.enumEntity[value];
    } else {
      const values = Object.keys(this.enumEntity).map(
        (key) => this.enumEntity[key],
      );
      const errorMessage = `the value ${value} is not valid. See the acceptable values: ${values}`;
      throw new BadRequestException(errorMessage);
    }
  }
}
