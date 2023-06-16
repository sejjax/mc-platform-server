import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class DeleteNotificationDto {
  @ApiProperty()
  @IsNumber()
  id: number;
}
