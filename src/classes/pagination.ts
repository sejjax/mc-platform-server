import { IsNumber, Max } from 'class-validator';
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_LIMIT } from '../constants/pagination.constant';

export class Pagination {
    @Max(PAGE_SIZE_LIMIT)
    @IsNumber()
        take: number = DEFAULT_PAGE_SIZE;
    @IsNumber()
        skip: number = 0;
}