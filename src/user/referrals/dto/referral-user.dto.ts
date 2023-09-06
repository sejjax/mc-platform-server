export class ReferralUserDto {
    partnerId: string;
    referrerId: string;
    fullName: string;
    mobile: string;
    avatarURL: string | null;
    refLevel: number;
    personalInvestments: number;
    structureInvestments: number;
    referralsCount: number;
    referrals: ReferralUserDto[] | null;
}