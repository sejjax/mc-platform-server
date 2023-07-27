export const generateDepositGuid = (depositId: number, transactionId?: number) => {
    const id = transactionId != null ? transactionId : depositId;
    return `${id}-${depositId}`;
};