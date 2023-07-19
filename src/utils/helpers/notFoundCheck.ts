import { HttpException, HttpStatus } from "@nestjs/common";

export const foundCheck =  (value: any, errorMessage: string) => {
    if(value == null)
      throw new HttpException(errorMessage, HttpStatus.NOT_FOUND)
}