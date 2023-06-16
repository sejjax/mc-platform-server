import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
  ValidateIf,
} from 'class-validator';

import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { IsPassword } from 'src/auth/validators/password.validator';
import { IsPartnerIdExists } from 'src/utils/validators/IsPartnerIdExists';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  fullName: string;

  @Validate(IsNotExist, ['User'], {
    message: 'incorrectEmail',
  })
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  country: string;

  @ValidateIf(({ mobile }) => !!mobile)
  @IsMobilePhone(null, {
    message: 'incorrectPhoneNumber',
  })
  @ApiProperty()
  mobile: string;

  @Validate(IsPassword)
  @ApiProperty()
  password: string;

  @IsOptional()
  @ValidateIf(({ referrerId }) => referrerId !== '')
  @Validate(IsPartnerIdExists, {
    message: 'incorrectPartnerId',
  })
  @ApiPropertyOptional()
  referrerId?: string;
}
