import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { CreateNotificationDto } from './create-notifcation.dto';

export class UpdateNotificationDto extends CreateNotificationDto {
  @ApiProperty()
  @IsNumber()
  id: number;
}
