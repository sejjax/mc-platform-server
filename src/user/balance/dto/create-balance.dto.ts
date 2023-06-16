import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { User } from 'src/users/user.entity';

export class CreateBalanceDto {
  @ApiProperty({ type: PartialType(User) })
  @IsNotEmpty()
  user: Partial<User>;

  @ApiProperty()
  @IsNotEmpty()
  current_platform_balance: number;

  @ApiProperty()
  @IsNotEmpty()
  available_to_withdraw_balance: number;
}
