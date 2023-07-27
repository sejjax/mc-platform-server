import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/user.entity';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import { PromotionService } from './promotion.service';

@Controller('promotion')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@ApiTags('Promotion')
export class PromotionController {
    constructor(private promotionService: PromotionService) {}

  @Get()
    async getPromotion(@AuthUser() user: User) {
        return this.promotionService.getPromotionData(user);
    }
}
