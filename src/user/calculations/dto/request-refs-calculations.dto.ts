import { JsonField } from '../../../utils/decorators/json-field.decorator';
import { RequestDataArray } from '../../../classes/request-data-array';
import { OptionalDateDto } from './date.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { AccrualType, Status } from '../calculations.types';
import { OneMany } from '../../../utils/types/oneMany';
import { Order } from '../../../utils/types/order';
import { Locale } from '../../../classes/locale';

export class RequestRefsCalculationsFilter extends OptionalDateDto {
    @IsOptional()
    // TODO: Реализовать валидатор для типа OneMany<T> на декораторе @Type
    status?: OneMany<Status>;

    @IsOptional()
    @IsEnum(AccrualType)
    accrual_type?: AccrualType;
}

export class RequestRefsCalculationsOrderBy {
    @IsOptional()
    @IsEnum(Order)
    payment_date?: Order;

    @IsOptional()
    @IsEnum(Order)
    referralFullName?: Order;

    @IsOptional()
    @IsEnum(Order)
    referralPartnerId?: Order;

    @IsOptional()
    @IsEnum(Order)
    wallet_addr?: Order;

    @IsOptional()
    @IsEnum(Order)
    amount?: Order;


    @IsOptional()
    @IsEnum(Order)
    percent?: Order;

    @IsOptional()
    @IsEnum(Order)
    accrual_type?: Order;

    @IsOptional()
    @IsEnum(Order)
    product?: Order;

    @IsOptional()
    @IsEnum(Order)
    status?: Order;
}

export class RequestRefsCalculationsDto extends RequestDataArray<RequestRefsCalculationsOrderBy> {
    @JsonField(RequestRefsCalculationsFilter)
    filters: RequestRefsCalculationsFilter;

    @JsonField(RequestRefsCalculationsOrderBy)
    orderBy: RequestRefsCalculationsOrderBy;

    @IsEnum(Locale)
    locale: Locale = Locale.EN;
}