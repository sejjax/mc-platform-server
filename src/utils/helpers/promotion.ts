import { toDatabaseDate } from './dates';

export const getPromotionDates = () => {
    const firstDate = toDatabaseDate(new Date(2023, 4, 1));
    const lastDate = toDatabaseDate(new Date(2023, 8, 1));
  
    return { firstDate, lastDate };
};
