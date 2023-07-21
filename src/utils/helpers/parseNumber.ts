import { HttpException, HttpStatus } from "@nestjs/common";

export const parseNumber = (num: string): number => {
    try {
        const res = parseInt(num)
        if(res == null || isNaN(res))
            throw new Error()
        return res;
    } catch {
        throw new HttpException("Validation failed (numeric string is expected)", HttpStatus.BAD_REQUEST);
    }
}