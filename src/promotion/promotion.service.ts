import { Injectable } from '@nestjs/common/decorators';
import { InjectRepository } from '@nestjs/typeorm';
import {
    getPromotionFirstStructureAmount,
    getPromotionTeamStructureQuery,
} from 'src/utils/helpers/getTeamTree';
import { Repository } from 'typeorm';
import { Promotion } from './promotion.entity';
import { GetPromotionResponse, PromotionRating, PromotionTeamQueryItem } from './promotion.types';
import { PromotionLevel } from './promotionLevels.entity';
import { User } from 'src/users/user.entity';
import { getPromotionDates } from 'src/utils/helpers/promotion';

@Injectable()
export class PromotionService {
    constructor(
    @InjectRepository(Promotion) private promotionRepo: Repository<Promotion>,
    @InjectRepository(PromotionLevel) private promotionLevelRepo: Repository<PromotionLevel>,
    ) {}

    async getPromotionData({ id, partnerId }: User): Promise<GetPromotionResponse> {
        const query = getPromotionTeamStructureQuery();
        const { firstDate, lastDate } = getPromotionDates();

        const items: PromotionTeamQueryItem[] = (
      (await this.promotionRepo.query(query, [partnerId, firstDate, lastDate])) as Omit<
        PromotionTeamQueryItem,
        'teamDeposit'
      >[]
        ).map<PromotionTeamQueryItem>((item) => ({ ...item, teamDeposit: 0 }));
        // They ordered by ref_level desc and we go from tail to head
        let allStructure = 0;
        let strongestStructure: GetPromotionResponse['strongestStructure'] = {
            amount: 0,
            fullName: null,
        };
        for (const item of items) {
            const itemSum = item.teamDeposit + +item.depositAmount;
            if (item.refLevel !== 1) {
                const upperUser = items.find((element) => element.partnerId === item.referrerId);
                if (!upperUser) continue;
                upperUser.teamDeposit += itemSum;
            }
            if (item.refLevel === 1) {
                allStructure += itemSum;
                if (itemSum > strongestStructure.amount) {
                    strongestStructure = {
                        fullName: item.fullName,
                        amount: itemSum,
                    };
                }
            }
        }
        const rating = await this.getPromotionRate();
        const promotionLevel = await this.getPromotionLevel(id);
        const firstStructure = await this.getFirstStructurePromotion(partnerId);
        return { allStructure, strongestStructure, rating, promotionLevel, firstStructure };
    }

    private async getPromotionRate(): Promise<PromotionRating[]> {
        return await this.promotionRepo.query(
            'select p.id, p."teamDeposit", p."userId", u."fullName" from public.promotion p left join public.user u on u.id = p."userId" where p."isComplete" = true order by p."teamDeposit" desc',
        );
    }

    private async getPromotionLevel(userId: number): Promise<number> {
        return (
            (
                await this.promotionLevelRepo.findOne({
                    where: {
                        user: userId,
                    },
                    select: ['level'],
                })
            )?.level ?? 0
        );
    }

    private async getFirstStructurePromotion(partnerId: string) {
        const query = getPromotionFirstStructureAmount();
        const { firstDate, lastDate } = getPromotionDates();

        const [{ sum }] = (await this.promotionRepo.query(query, [partnerId, firstDate, lastDate])) as [
      { sum: number },
    ];
        return sum;
    }
}
