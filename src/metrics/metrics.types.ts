import { Calculation } from 'src/user/calculations/entities/calculation.entity';
import { Deposit } from 'src/user/deposit/entities/deposit.entity';
import { User } from 'src/users/user.entity';

export interface IMetricsProjectItem {
  id: number;
  title: string;
  projectIncome: number;
  projectPayments: number;
  depositCount: number;
  amountToPay: number
}

export interface IMetricsPartnerItem {
  id: number;
  fio: string;
  country: string;
  mobile: string;
  referralsCount: number;
  productIncome: number;
  referralsIncome: number;
  teamDeposit: number;
  depositAmount: number;
}

export interface IMetricsResponse {
  activeUsers: number;
  sumAllSendedProducts: number;
  sumAllSendedReferrals: number;
  sumAccrualsInTheNextSevenDays: number;
  allAccruals: number
  inactiveUsers: number;
  platformIncome: number;
  projectRates: {
    day: IMetricsProjectItem[];
    week: IMetricsProjectItem[];
    month: IMetricsProjectItem[];
    year: IMetricsProjectItem[];
  };
  partnerRates: {
    day: IMetricsPartnerItem[];
    week: IMetricsPartnerItem[];
    month: IMetricsPartnerItem[];
    year: IMetricsPartnerItem[];
  };
}

export interface IProject {
  payment_period_in_weeks: string;
  invest_period_in_weeks: string;
  name: string;
  payment_period: string;
  apy: number;
  invest_period: string;
  min_amount: string;
  service_name: string;
  slug: string;
  id: number;
}

export interface ISortedItems<Item> {
  day: Item[];
  week: Item[];
  month: Item[];
  year: Item[];
}
export interface ISortedItem<Item> {
  day: Item;
  week: Item;
  month: Item;
  year: Item;
}

export interface ISortedItemsMerged {
  sortedDeposits: ISortedItems<Deposit>;
  sortedCalculations: ISortedItems<CalculationWithServiceName>;
}

export interface CalculationWithServiceName extends Calculation {
  service_name: string;
}

export const differenceInDay = 1000 * 3600 * 24;
export const differenceInWeek = differenceInDay * 7;
export const differenceInMonth = differenceInWeek * 4;
export const differenceInYear = differenceInDay * 365;

export interface UserWithRefs extends Omit<User, 'loadPassword' | 'setPassword' | 'setPartnerId'> {
  referrals: User[];
}
