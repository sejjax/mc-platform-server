import { Expose } from 'class-transformer';
import { BaseEntityDto } from 'src/base/base-entity.dto';
import { User } from 'src/users/user.entity';
import { File } from 'src/files/file.entity';
import { InvestorLevel } from 'src/users/consts';
import { Role } from 'src/users/roles.entity';
import { UserAgreementType } from 'src/users/users.types';

export class ProfileUserDto extends BaseEntityDto<User, ProfileUserDto>() {
  investorLevel: InvestorLevel;
  baseDepositLevel: number;
  needToAllStructure: { value: number; percent: number };
  needToFirstStructure: { value: number; percent: number };
  @Expose() id: number;
  @Expose() fullName: string;
  @Expose() photo: File;
  @Expose() email: string;
  @Expose() country: string;
  @Expose() mobile: string;
  @Expose() level: number;
  @Expose() deposit: number;
  @Expose() default_wallet_address: string;
  @Expose() partnerId: string;
  @Expose() createdAt: Date;
  @Expose() isAdmin: boolean;
  @Expose() role: Role;
  @Expose() agreement: UserAgreementType;
}
