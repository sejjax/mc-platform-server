import { JsonField } from '../../../utils/decorators/json-field.decorator';
import { RequestDataArray } from '../../../classes/request-data-array';
import { OptionalDateDto } from './date.dto';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { AccrualType, Status } from '../calculations.types';
import { OneMany } from '../../../utils/types/oneMany';
import { Order } from '../../../utils/types/order';
import { Id } from '../../deposit/deposit.types';
import { Locale } from '../../../classes/locale';

export class RequestServiceCalculationsFilter extends OptionalDateDto {
    @IsOptional()
    @IsEnum(Status)
    // TODO: Реализовать валидатор для типа OneMany<T> на декораторе @Type
    status?: OneMany<Status>;

    @IsOptional()
    @IsEnum(AccrualType)
    // TODO: Реализовать валидатор для типа OneMany<T> на декораторе @Type
    accrual_type?: OneMany<AccrualType>;

    @IsOptional()
    @IsNumber()
    productId?: Id;
}

export class RequestServiceCalculationsOrderBy {
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

export class RequestServiceCalculationsDto extends RequestDataArray<RequestServiceCalculationsOrderBy> {
    @JsonField(RequestServiceCalculationsFilter)
    filters: RequestServiceCalculationsFilter;

    @JsonField(RequestServiceCalculationsOrderBy)
    orderBy: RequestServiceCalculationsOrderBy;

    locale: Locale;
}