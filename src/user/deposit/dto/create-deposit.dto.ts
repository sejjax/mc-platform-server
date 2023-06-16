import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { User } from 'src/users/user.entity';
import { DepositPackageType } from '../deposit.types';

export class CreateDepositDto {
  @ApiProperty({ description: 'Set record id for update existing' })
  @IsOptional()
  id?: number;

  @ApiProperty({ type: PartialType(User), example: { id: 1 } })
  @IsNotEmpty()
  user: Partial<User>;

  @ApiProperty({ example: 'BUSD' })
  @IsNotEmpty()
  @IsString()
  currency: string;

  @ApiProperty({ example: 'investor-basic' })
  @IsNotEmpty()
  product: string;

  @ApiProperty({ example: 'investor-basic' })
  @IsNotEmpty()
  product_service_description: string;

  @ApiProperty({ example: 'investor-basic' })
  @IsNotEmpty()
  apy: string;

  @ApiProperty({ example: '1day' })
  @IsNotEmpty()
  investment_period: string;

  @ApiProperty({ example: '4' })
  @IsNotEmpty()
  ip_wks: string;

  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  pp_wks: string;

  @ApiProperty({ example: '3day' })
  @IsNotEmpty()
  payment_period: string;

  @ApiProperty({ example: 154.45 })
  @IsNotEmpty()
  currency_amount: number;

  @ApiProperty({ example: '0x024e6425aEff78B9b54DeF4B149DE6Ba06C3098c' })
  @IsNotEmpty()
  @IsString()
  wallet_addr: string;

  @ApiProperty({ example: 'Date' })
  @IsString()
  @IsOptional()
  date?: string;
}
