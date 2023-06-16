import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotionController } from './promotion.controller';
import { Promotion } from './promotion.entity';
import { PromotionService } from './promotion.service';
import { PromotionLevel } from './promotionLevels.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Promotion, PromotionLevel])],
  providers: [PromotionService],
  controllers: [PromotionController],
})
export class PromotionModule {}
