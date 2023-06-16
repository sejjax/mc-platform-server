import { Expose } from 'class-transformer';
import { BaseEntityDto } from 'src/base/base-entity.dto';
import { Deposit } from 'src/user/deposit/entities/deposit.entity';
import { User } from 'src/users/user.entity';
import { AccrualType, Status } from '../calculations.types';
import { Calculation } from '../entities/calculation.entity';

export class CreateCalculationsDto extends BaseEntityDto<
  Calculation,
  CreateCalculationsDto
>() {
  @Expose() user: User;
  @Expose() wallet_addr?: string;
  @Expose() amount: number;
  @Expose() percent: string;
  @Expose() accrual_type: AccrualType;
  @Expose() product: Deposit;
  @Expose() status?: Status;
}
