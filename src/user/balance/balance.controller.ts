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
import { User } from 'src/users/user.entity';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import { BalanceService } from 'src/user/balance/balance.service';
import { CreateBalanceDto } from 'src/user/balance/dto/create-balance.dto';

@Controller('user/balance')
@UseGuards(AuthGuard('jwt'))
@ApiTags('User balance')
@ApiBearerAuth()
export class BalanceController {
  constructor(private balanceService: BalanceService) {}

  @Post()
  create(
    @AuthUser() user: User,
    @Body()
    createUserBalanceDto: CreateBalanceDto,
  ) {
    if (user.id !== createUserBalanceDto.user.id)
      if (!user.isAdmin) throw new UnauthorizedException();
    return this.balanceService.createOrUpdate(createUserBalanceDto);
  }

  @Get()
  findMy(@Req() req: Request & { user: User }) {
    return this.balanceService.findByUser(req.user);
  }

  @Get(':id')
  async findByUserId(@AuthUser() user: User, @Param('id') id: string) {
    if (user.id !== +id) if (!user.isAdmin) throw new UnauthorizedException();
    return this.balanceService.findByUser({ id: id } as unknown as User);
  }
}
