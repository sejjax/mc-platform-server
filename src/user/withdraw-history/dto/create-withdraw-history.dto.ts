import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
    IsDateString,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';
import { User } from 'src/users/user.entity';

export class CreateWithdrawHistoryDto {
  @ApiProperty({ description: 'Set record id for update existing' })
  @IsOptional()
  id?: number;

  @ApiProperty({ type: PartialType(User), example: { id: 1 } })
  @IsNotEmpty()
  user: Partial<User>;

  @ApiProperty({ example: 'BNB' })
  @IsNotEmpty()
  @IsString()
  currency: string;

  @ApiProperty({ example: 154.45 })
  @IsNotEmpty()
  platform_amount: number;

  @ApiProperty({ example: 154.45 })
  @IsNotEmpty()
  currency_amount: number;

  @ApiProperty({ example: '0x024e6425aEff78B9b54DeF4B149DE6Ba06C3098c' })
  @IsNotEmpty()
  @IsString()
  wallet_addr: string;

  @ApiProperty({ type: Date })
  @IsNotEmpty()
  @IsDateString()
  date: Date;
}
