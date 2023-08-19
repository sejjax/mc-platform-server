import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import { User } from 'src/users/user.entity';
import { ReferralsService } from 'src/user/referrals/referrals.service';
import { ReferralUserDto } from 'src/user/referrals/dto/referral-user.dto';

@UseGuards(AuthGuard('jwt'))
@ApiTags('Users referrals info')
@ApiBearerAuth()
@Controller('user/referrals')
export class ReferralsController {
    constructor(
        private referralsService: ReferralsService,
    ) {}
    @Get('/list')
    async getReferralsList(@AuthUser() user: User): Promise<ReferralUserDto[]> {
        return await this.referralsService.getReferrals(user.partnerId);
    }
}