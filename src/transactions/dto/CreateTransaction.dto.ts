import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Slug of project category for this transaction',
    example: 'basic5',
  })
  @IsString()
  product_service_description: string;

  @ApiProperty()
  @IsString()
  amount: string;

  @ApiProperty()
  @IsString()
  wallet_addr: string;
}
