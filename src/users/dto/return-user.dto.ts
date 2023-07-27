import { InvestorLevel } from '../consts';
import { Role } from '../roles.entity';
import { IUserDataWithRole, UserAgreementType } from '../users.types';

export class ReturnUserDto {
  id: number;
  country: string;
  default_wallet_address: string;
  email: string;
  level: number;
  username: string;
  fullName: string;
  investorLevel: InvestorLevel;
  isAdmin: boolean;
  role: Role | null;
  agreement: UserAgreementType;
  partnerId: string;

  constructor(user: IUserDataWithRole) {
      const {
          id,
          country,
          default_wallet_address,
          level,
          username,
          fullName,
          email,
          investor_level,
          isAdmin,
          role,
          agreement,
          partnerId,
      } = user;

      this.agreement = agreement;
      this.id = id;
      this.partnerId = partnerId;
      this.country = country;
      this.default_wallet_address = default_wallet_address;
      this.level = level;
      this.username = username;
      this.fullName = fullName;
      this.email = email;
      this.investorLevel = investor_level;
      this.isAdmin = isAdmin;
      this.role = { ...role, access: JSON.parse(role?.access ?? '[]') };
  }
}
