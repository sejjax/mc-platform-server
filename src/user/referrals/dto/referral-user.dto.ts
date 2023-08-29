export class ReferralUserDto {
    partnerId: string;
    fullName: string;
    mobile: string;
    avatarURL: string | null;
    refLevel: number;
    personalInvestments: number;
    structureInvestments: number;
    referralsCount: number;
    referrals: ReferralUserDto[] | null;
}