import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Validate } from 'class-validator';
import { IsPassword } from '../validators/password.validator';

export class ResetPasswordDto {
  @Validate(IsPassword)
  @ApiProperty({ description: 'New password' })
  password: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Hash from `forgot-password`' })
  hash: string;
}
