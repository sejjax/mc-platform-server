import { Calculation } from './entities/calculation.entity';

export enum AccrualType {
  referral = 'referral',
  product = 'product',
  passive = 'passive',
  upgrade = 'upgrade',
}

export enum Status {
  waiting = 'waiting',
  sent = 'sent',
  error = 'error',
  nulled = 'nulled',
}

export const CalculationPercentsFromLevel = {
  0: 3,
  1: 6,
  2: 8,
  3: 10,
  4: 12,
  5: 13,
  6: 14,
  7: 15,
  8: 16,
  9: 17,
};

export const generateCalculationsQueue = 'generateCalculationsQueue';
export const generateCalculationsCron = 'generateCalculationsCron';

export interface CalculationWithByOrder extends Calculation {
  buyOrder: number;
}
