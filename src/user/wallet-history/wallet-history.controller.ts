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
import { CreateWalletHistoryDto } from 'src/user/wallet-history/dto/create-wallet-history.dto';
import { WalletHistoryService } from 'src/user/wallet-history/wallet-history.service';
import { User } from 'src/users/user.entity';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';

@Controller('user/wallet-history')
@UseGuards(AuthGuard('jwt'))
@ApiTags('User wallet history')
@ApiBearerAuth()
export class WalletHistoryController {
  constructor(private walletHistoryService: WalletHistoryService) {}

  @Post()
  create(
    @AuthUser() user: User,
    @Body()
    createWalletHistoryDto: CreateWalletHistoryDto,
  ) {
    if (user.id !== createWalletHistoryDto.user.id)
      if (!user.isAdmin) throw new UnauthorizedException();
    return this.walletHistoryService.createOrUpdate(createWalletHistoryDto);
  }

  @Get()
  findMy(@Req() req: Request & { user: User }) {
    return this.walletHistoryService.findByUser(req.user);
  }

  @Get(':id')
  async findByUserId(@AuthUser() user: User, @Param('id') id: string) {
    if (user.id !== +id) if (!user.isAdmin) throw new UnauthorizedException();
    return this.walletHistoryService.findByUser({ id: id } as unknown as User);
  }
}
