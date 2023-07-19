import { IsObject, ValidateNested } from "class-validator";
import { Transform } from "class-transformer";
import { HttpException, HttpStatus } from "@nestjs/common";

export function JsonField(): PropertyDecorator {
  /* Date from request must be provided in ISO format. */
  const fn = obj => {
    try {
      return JSON.parse(obj.value)
    } catch (e) {
      throw new HttpException("Invalid json", HttpStatus.UNPROCESSABLE_ENTITY)
    }
  }

  return function (target, propertyKey) {
    IsObject()(target, propertyKey)
    ValidateNested()(target, propertyKey)
    Transform(fn)(target, propertyKey)
  }
}