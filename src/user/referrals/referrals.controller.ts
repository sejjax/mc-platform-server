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
    @Get('/tree/full')
    async getReferralsTree(@AuthUser() user: User): Promise<ReferralUserDto[]> {
        return await this.referralsService.getReferrals(user.partnerId);
    }

    @Get('/tree/part')
    async getReferralsTreePart(
        @AuthUser() user: User,
        @Query('userPartnerId', new DefaultValuePipe(null)) userPartnerId?: string,
    ): Promise<ReferralUserDto[]> {
        return await this.referralsService.getPartOfReferrals(userPartnerId ?? user.partnerId);
    }

    @Get('/me')
    async getReferralsMe(@AuthUser() user: User): Promise<any> {
        return await this.referralsService.getUserAsReferralUser(user);
    }

    @Get('/graphic/invitedUsers')
    async getGraphicInvitedUsers(
        @AuthUser() user: User,
        @Query('partnerId') partnerId?: string
    ): Promise<GraphicDataInvitedUsersDto[]> {
        return await this.referralsService.getGraphicInvitedUsers(user, partnerId);
    }

    @Get('/graphic/investedFunds')
    async getGraphicInvestedFunds(
        @AuthUser() user: User,
        @Query('partnerId') partnerId?: string
    ): Promise<GraphicDataInvestedFundsDto[]> {
        return await this.referralsService.getGraphicInvestedFunds(user, partnerId);
    }

    @Get('/graphic/investmentsByTypes')
    async getGraphicInvestmentsByTypes(
        @AuthUser() user: User,
        @Query('partnerId') partnerId?: string
    ): Promise<GraphicDataInvestmentsByTypesDto[]> {
        return await this.referralsService.getGraphicInvestmentsByTypes(user, partnerId);
    }
}