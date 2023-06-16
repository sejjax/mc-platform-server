import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  hash: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  referrerId?: string;

  @IsOptional()
  @ApiPropertyOptional()
  isAdmin: boolean;
}
