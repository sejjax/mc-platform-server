import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty()
  @IsString()
  notification_title: string;

  @ApiProperty()
  @IsString()
  notification_text: string;

  @ApiProperty({
    description:
      "Should contain values like ['all'] to notify all users, or [42,68] to notify user with ids in array",
  })
  @IsArray()
  whom_notify: (string | number)[];

  @ApiProperty()
  @IsDateString()
  notification_date: string;

  @ApiProperty()
  @IsBoolean()
  isSite: boolean;

  @ApiProperty()
  @IsBoolean()
  isEmail: boolean;

  @ApiProperty()
  @IsNumber()
  notification_type: number;
}
