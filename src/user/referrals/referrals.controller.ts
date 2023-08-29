import { Controller, DefaultValuePipe, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import { User } from 'src/users/user.entity';
import { ReferralsService } from 'src/user/referrals/referrals.service';
import { ReferralUserDto } from 'src/user/referrals/dto/referral-user.dto';
import { GraphicDataInvitedUsersDto } from 'src/user/referrals/dto/graphic-data-invited-users.dto';
import { GraphicDataInvestedFundsDto } from 'src/user/referrals/dto/graphic-data-invested-funds.dto';
import { GraphicDataInvestmentsByTypesDto } from 'src/user/referrals/dto/graphic-data-investments-by-types.dtos';

@UseGuards(AuthGuard('jwt'))
@ApiTags('Users referrals info')
@ApiBearerAuth()
@Controller('user/referrals')
export class ReferralsController {
    constructor(
        private referralsService: ReferralsService,
    ) {}
    @Get('/tree')
    async getReferralsTree(@AuthUser() user: User): Promise<ReferralUserDto[]> {
        return await this.referralsService.getReferrals(user.partnerId);
    }

    @Get('/treePart')
    async getReferralsTreePart(
        @AuthUser() user: User,
        @Query('userPartnerId', new DefaultValuePipe(null)) userPartnerId?: string,
        @Query('userRefLevel', new DefaultValuePipe(null)) userRefLevel?: number
    ): Promise<ReferralUserDto[]> {
        return await this.referralsService.getPartOfReferrals(userPartnerId ?? user.partnerId, userRefLevel ?? -1);
    }

    @Get('/me')
    async getReferralsMe(@AuthUser() user: User): Promise<any> {
        return await this.referralsService.getUserAsReferralUser(user);
    }

    @Get('/graphic/invitedUsers')
    async getGraphicInvitedUsers(@AuthUser() user: User): Promise<GraphicDataInvitedUsersDto[]> {
        return await this.referralsService.getGraphicInvitedUsers(user);
    }

    @Get('/graphic/investedFunds')
    async getGraphicInvestedFunds(@AuthUser() user: User): Promise<GraphicDataInvestedFundsDto[]> {
        return await this.referralsService.getGraphicInvestedFunds(user);
    }

    @Get('/graphic/investmentsByTypes')
    async getGraphicInvestmentsByTypes(@AuthUser() user: User): Promise<GraphicDataInvestmentsByTypesDto[]> {
        return await this.referralsService.getGraphicInvestmentsByTypes(user);
    }
}