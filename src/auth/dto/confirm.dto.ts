import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ConfirmDto {
  @IsNotEmpty()
  @ApiProperty()
  hash: string;
}
