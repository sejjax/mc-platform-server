export class InvestmentInfoDto {
    totalInvestments: number;
    currentInvestments: number;
    totalIncome: number;
    totalInvestmentsReturn: number;
    totalPayed: number;
    futureIncome: number;
    futureInvestmentsReturn: number;
    futurePayed: number;
    finalProfit: number;
    graphicData: {
        date: Date;
        inInvesting: number;
        payed: number;
    }[];
}