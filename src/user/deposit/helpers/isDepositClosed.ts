import { getToday } from '../../../utils/helpers/dates';

export const isDepositClosed = (deposit: {date: Date, ip_wks: string}): boolean => {
    const DAYS_PER_WEEK  = 7;
    const depositExpirationDate =  deposit.date;
    depositExpirationDate.setDate(depositExpirationDate.getDate() + DAYS_PER_WEEK * Number(deposit.ip_wks));
    const today = getToday();
    return today > depositExpirationDate.getTime();
};