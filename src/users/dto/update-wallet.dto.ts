import { ApiProperty } from '@nestjs/swagger';

export class UpdateWalletDto {
  @ApiProperty()
  default_wallet_address: string;
}
