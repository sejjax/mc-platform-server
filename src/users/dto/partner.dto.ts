import { Expose, Transform } from 'class-transformer';

export class PartnerDto {
  @Expose()
  id: number;

  @Expose()
  ref_level: number;

  @Expose()
  fullName: string;

  @Expose()
  partnerId: string;

  @Expose()
  referrerId: string;

  @Expose()
  level: number;

  @Expose()
  country: string;

  @Expose()
  city: string;

  @Expose()
  agreement: number;

  @Expose()
  @Transform(({ obj }) => {
      if (+obj.agreement === 1) return obj.mobile;
      return 'Номер скрыт';
  })
  mobile: string;

  @Expose()
  @Transform(({ obj }) => {
      if (+obj.agreement === 1) return obj.deposit_amount;
      return 'Данные скрыты';
  })
  deposit_amount: number;

  @Expose()
  @Transform(({ obj }) => {
      if (+obj.agreement === 1) return obj.teamDeposit;
      return 'Данные скрыты';
  })
  teamDeposit: number;

  @Expose()
  createdAt: string;

  @Expose()
  firstReferrals: number;
}
