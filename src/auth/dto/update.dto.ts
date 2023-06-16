import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsMobilePhone,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  Validate,
} from 'class-validator';
import { IsPassword } from 'src/auth/validators/password.validator';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { File } from 'src/files/file.entity';
import { UserAgreement, UserAgreementType } from 'src/users/users.types';

export class UpdateDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional()
  fullName?: string;

  @IsOptional()
  @Validate(IsExist, ['File', 'id'], {
    message: 'imageNotExists',
  })
  @ApiPropertyOptional()
  photo?: File;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional()
  country?: string;

  @IsOptional()
  @IsMobilePhone(null, {
    message: 'incorrectPhoneNumber',
  })
  @IsNotEmpty()
  @ApiPropertyOptional()
  mobile?: string;

  @IsString()
  @IsOptional()
  @Validate(IsPassword)
  @ApiPropertyOptional()
  oldPassword?: string;

  @IsString()
  @IsOptional()
  @Validate(IsPassword)
  @ApiPropertyOptional()
  password?: string;

  @IsOptional()
  @ApiPropertyOptional()
  isAdmin: boolean;

  @ApiProperty({
    type: 'number',
    description: 'Contains values of UserAgreementType : 0 | 1 | 2',
  })
  @IsNumber()
  @Min(UserAgreement[0])
  @Max(UserAgreement[UserAgreement.length - 1])
  agreement: UserAgreementType;
}
