import { IsEnum, IsOptional } from 'class-validator';
import { Order } from 'src/utils/types/order';
import { JsonField } from 'src/utils/decorators/json-field.decorator';
import { RequestDataArray } from 'src/classes/request-data-array';

export class RequestTeamStructureReferralsOrderBy {
    @IsEnum(Order)
    @IsOptional()
    partnerId?: Order;

    @IsEnum(Order)
    @IsOptional()
    fullName?: Order;

    @IsEnum(Order)
    @IsOptional()
    mobile?: Order;
}

export class RequestTeamStructureReferralsDto extends RequestDataArray<RequestTeamStructureReferralsOrderBy> {
    @JsonField(RequestTeamStructureReferralsOrderBy)
    orderBy: RequestTeamStructureReferralsOrderBy;
}