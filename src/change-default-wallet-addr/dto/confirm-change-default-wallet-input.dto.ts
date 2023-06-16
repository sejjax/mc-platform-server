import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ConfirmChangeDefaultWalletAddrDto {
  @ApiProperty()
  @IsString()
  hash: string;
}
