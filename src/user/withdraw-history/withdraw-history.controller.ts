import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateWithdrawHistoryDto } from 'src/user/withdraw-history/dto/create-withdraw-history.dto';
import { WithdrawHistoryService } from 'src/user/withdraw-history/withdraw-history.service';
import { User } from 'src/users/user.entity';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';

@Controller('user/withdraw-history')
@UseGuards(AuthGuard('jwt'))
@ApiTags('User withdraw history')
@ApiBearerAuth()
export class WithdrawHistoryController {
  constructor(private withdrawHistoryService: WithdrawHistoryService) {}

  @Post()
  create(
    @AuthUser() user: User,
    @Body()
    createWithdrawHistoryDto: CreateWithdrawHistoryDto,
  ) {
    if (user.id !== createWithdrawHistoryDto.user.id)
      if (!user.isAdmin) throw new UnauthorizedException();
    return this.withdrawHistoryService.createOrUpdate(createWithdrawHistoryDto);
  }

  @Get()
  findMy(@Req() req: Request & { user: User }) {
    return this.withdrawHistoryService.findByUser(req.user);
  }

  @Get(':id')
  async findByUserId(@AuthUser() user: User, @Param('id') id: string) {
    if (user.id !== +id) if (!user.isAdmin) throw new UnauthorizedException();
    return this.withdrawHistoryService.findByUser({
      id: id,
    } as unknown as User);
  }
}
