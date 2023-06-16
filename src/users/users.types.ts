import { CreateUserDto } from './dto/create-user.dto';
import { TeamInfoDto } from './dto/team-info.dto';
import { Role } from './roles.entity';
import { User } from './user.entity';

export const firstStructureLevels = {
  500: 1,
  1000: 2,
  5000: 3,
  10000: 4,
  20000: 5,
  50000: 6,
  100000: 7,
  200000: 8,
  300000: 9,
};
export const allStructureLevels = {
  1000: 1,
  5000: 2,
  25000: 3,
  125000: 4,
  625000: 5,
  3000000: 6,
  15000000: 7,
  75000000: 8,
  375000000: 9,
};
export interface UserFilter {
  id?: string | number;
  email?: string;
}

export interface UserIdentifierDto {
  identifier: string;
}

export interface UserWithDepositAmount extends User {
  deposit_amount?: string | number;
}

export interface CreateUserConfirmDto extends CreateUserDto {
  callback: (user: User) => Promise<void>;
}

export interface IUserDataWithRole extends User {
  role: Role | null;
}

export interface TeamUserStructure {
  fullName: string;
  partnerId: string;
  referrals: GetReferralsUserFromCustomQuery[];
  teamInfo: TeamInfoDto;
}

export interface GetReferralsUserFromCustomQuery {
  createdAt: Date | string;
  fullName: string;
  agreement: UserAgreementType;
  id: number;
  level: number;
  mobile: string;
  partnerId: string;
  referrerId: string;
  country: string;
  firstReferrals: number;
  deposit_amount: number;
  teamDeposit: number;
}

export interface GetReferralsUserWithDepositAmountFromCustomQuery {
  createdAt: string;
  fullName: string;
  deposit_amount: number;
  id: number;
  level: number;
  mobile: string;
  partnerId: string;
  referrerId: string;
  country: string;
  firstReferrals: number;
}
export interface GetReferralsUserFromCustomQueryWithRefs extends GetReferralsUserFromCustomQuery {
  referrals: GetReferralsUserFromCustomQuery[];
}

export const UserAgreement = [0, 1, 2] as const;
export type UserAgreementType = typeof UserAgreement[number];

