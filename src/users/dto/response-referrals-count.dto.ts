import { ReferralCount } from '../users.types';


export class ResponseReferralsCountDto {
    referralsCount: ReferralCount[];
    referralsWithoutAnyDepositsCount: number;
}