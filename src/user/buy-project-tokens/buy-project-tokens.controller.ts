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
import { BuyProjectTokensService } from 'src/user/buy-project-tokens/buy-project-tokens.service';
import { CreateBuyProjectTokensDto } from 'src/user/buy-project-tokens/dto/create-buy-project-tokens.dto';
import { User } from 'src/users/user.entity';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';

@Controller('user/buy-project-tokens')
@UseGuards(AuthGuard('jwt'))
@ApiTags('User buy project tokens history')
@ApiBearerAuth()
export class BuyProjectTokensController {
  constructor(private buyProjectTokensService: BuyProjectTokensService) {}

  @Post()
  create(
    @AuthUser() user: User,
    @Body()
    createBuyProjectTokensDto: CreateBuyProjectTokensDto,
  ) {
    if (user.id !== createBuyProjectTokensDto.user.id)
      if (!user.isAdmin) throw new UnauthorizedException();
    return this.buyProjectTokensService.createOrUpdate(
      createBuyProjectTokensDto,
    );
  }

  @Get()
  findMy(@Req() req: Request & { user: User }) {
    return this.buyProjectTokensService.findByUser(req.user);
  }

  @Get(':id')
  async findByUserId(@AuthUser() user: User, @Param('id') id: string) {
    if (user.id !== +id) if (!user.isAdmin) throw new UnauthorizedException();
    return this.buyProjectTokensService.findByUser({
      id: id,
    } as unknown as User);
  }
}
