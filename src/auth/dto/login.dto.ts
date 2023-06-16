import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Validate } from 'class-validator';
import { IsIdentifier } from '../validators/identifier.validator';

export class LoginDto {
  @Validate(IsIdentifier)
  @IsNotEmpty()
  @ApiProperty({ example: 'first@mail.com', description: 'Email or phone' })
  identifier: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'Test1234!' })
  password: string;
}
