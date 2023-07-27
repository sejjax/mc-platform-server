import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/user.entity';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import { ChangeDefaultWalletAddressService } from './change-default-wallet-addr.service';
import { ChangeDefaultWalletAddrInputDto } from './dto/change-default-wallet-addr-input.dto';
import { ConfirmChangeDefaultWalletAddrDto } from './dto/confirm-change-default-wallet-input.dto';

@Controller('change-default-wallet-addr')
export class ChangeDefaultWalletAddressController {
    constructor(private changeDefaultWalletAddrService: ChangeDefaultWalletAddressService) {}
  @Post()
  @UseGuards(AuthGuard('jwt'))
    async changeDefaultWalletAddr(
    @Body() inputData: ChangeDefaultWalletAddrInputDto,
    @AuthUser() user: User,
    ) {
        return this.changeDefaultWalletAddrService.changeDefaultWalletAddr(inputData, user);
    }

  @Post('/confirm')
  async confirmWalletAddr(@Body() inputData: ConfirmChangeDefaultWalletAddrDto) {
      return this.changeDefaultWalletAddrService.confirmChangeWallet(inputData.hash);
  }
}
