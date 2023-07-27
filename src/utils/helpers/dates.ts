export const getToday = () => {
    const today = new Date();
    today.setHours(3, 0, 0, 0);
    return today.getTime();
};

export const toDatabaseDate = (date: Date): string => {
    const year = date.getFullYear();
    const formatedMonth = (date.getMonth() + 1).toString().padStart(2, '0');
    const formatedDay = date.getDate().toString().padStart(2, '0');

    return `${year}-${formatedMonth}-${formatedDay}`;
};

export const getCalculationsPaymentDateFormat = (date: Date) => date.toISOString().slice(0, 10);
