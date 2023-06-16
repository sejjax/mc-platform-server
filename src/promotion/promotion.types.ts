export interface PromotionRating {
  id: number;
  userId: number;
  teamDeposit: number;
  fullName: string;
}
export interface GetPromotionResponse {
  allStructure: number;
  firstStructure: number;
  promotionLevel: number;
  strongestStructure: { fullName: null | string; amount: number };
  rating: PromotionRating[];
}

export interface PromotionTeamQueryItem {
  fullName: string;
  id: number;
  partnerId: string;
  referrerId: string;
  refLevel: number;
  depositAmount: string;
  teamDeposit: number;
}
