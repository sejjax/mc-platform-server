import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChangeDefaultWalletAddrInputDto {
  @ApiProperty()
  @IsString()
  new_wallet: string;
}
