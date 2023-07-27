import { Deposit } from './entities/deposit.entity';

export type DepositPackageType = 'basic1' | 'basic2' | 'basic3' | 'basic4' | 'basic5';

export interface IReturnDeposit extends Partial<Deposit> {
  userLevel: number;
}

export interface IReferalsArrayItem {
  id: number;
  level: number;
}

export const DepositPackage = {
    basic1: 1,
    basic5: 4,
    basic2: 1,
    basic3: 1,
    basic4: 3,
};

export enum DepositStatus {
  waiting_approval = 'waiting_approval',
  waiting_calculation = 'waiting_calculation',
  calculated = 'calculated',
}

export interface InvestorProDepositAmountReponse {
  allPackages: number;
  perUser: number;
}

export type Guid = string;
export type Id = number;