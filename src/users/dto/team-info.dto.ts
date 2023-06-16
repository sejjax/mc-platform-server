import { Expose } from 'class-transformer';

export class TeamInfoDto {
  @Expose()
  firstDeposit: string;
  @Expose()
  firstReferrals: number;
  @Expose()
  firstReferralsIncome: string;
  @Expose()
  referralsIncome: string;
  @Expose()
  teamDeposit: string;
  @Expose()
  totalReferrals: number;
}
