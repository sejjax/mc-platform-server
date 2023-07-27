import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';
import { UserAgreement, UserAgreementType } from '../users.types';

export class SetAgreementDto {
  @ApiProperty({
      type: 'number',
      description: 'Contains values of UserAgreementType : 0 | 1 | 2',
  })
  @IsNumber()
  @Min(UserAgreement[0])
  @Max(UserAgreement[UserAgreement.length - 1])
  agreement: UserAgreementType;
}
