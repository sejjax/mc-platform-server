import { IsNumber, IsString } from 'class-validator';

export class NotificationsDto {
  @IsNumber()
  id: number;

  @IsString()
  notification_type: string;

  @IsString()
  notification_title: string;

  @IsString()
  notification_text: string;

  @IsNumber()
  notification_date: number;
}
