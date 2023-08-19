export class ReferralUserDto {
    partnerId: string;
    fullName: string;
    mobile: string;
    refLevel: number;
    personalInvestments: number;
    structureInvestments: number;
    referrals: ReferralUserDto[];
}