import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
    IsDateString,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';
import { User } from 'src/users/user.entity';

export class CreateBuyProjectTokensDto {
  @ApiProperty({ description: 'Set record id for update existing' })
  @IsOptional()
  id?: number;

  @ApiProperty({ type: PartialType(User), example: { id: 1 } })
  @IsNotEmpty()
  user: Partial<User>;

  @ApiProperty({ example: 'xswap_protocol_first_round' })
  @IsNotEmpty()
  @IsString()
  project_system_name: string;

  @ApiProperty({ example: 154.45 })
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: 20.05 })
  @IsNotEmpty()
  APY: number;

  @ApiProperty({ type: Date })
  @IsNotEmpty()
  @IsDateString()
  Unlock_date: Date;
}
