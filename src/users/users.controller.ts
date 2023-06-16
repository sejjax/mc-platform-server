import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileUploadDto } from 'src/files/dto/file.dto';
import { PhotoUploadDto } from 'src/users/dto/photo.dto';
import { RequestWithUser } from 'src/utils/interfaces/common';
import { EnumValidationPipe } from 'src/utils/validators/enum.validator';
import { BaseEntityController } from '../base/base-entity.controller';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { PackagesService } from './packages.service';
import { Levels } from './consts';
import { plainToInstance } from 'class-transformer';
import { PartnerDto } from 'src/users/dto/partner.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { ProfileUserDto } from 'src/auth/dto/profile-user.dto';
import { RoleGuard } from 'src/roles/roles.guard';
import { UserFilter } from './users.types';
import { SetAgreementDto } from './dto/set-agreement.dto';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
@ApiTags('Users')
@ApiBearerAuth()
export class UsersController extends BaseEntityController<User, UserFilter, UserDto> {
  constructor(private usersService: UsersService, private packagesService: PackagesService) {
    super(usersService, UserDto);
  }

  @Get('/:id')
  async findUser(@Param('id', ParseIntPipe) id: string): Promise<UserDto> {
    const user = await this.usersService.getUser(id);

    return UserDto.create(user);
  }

  @Get('/me/referrals')
  async countReferrals(@Req() req: any): Promise<number[]> {
    const userId = req.user.id;
    const user = await this.findOne(userId);

    return this.usersService.countReferrals(user.partnerId);
  }

  @Get('/me/income')
  async getIncome(@AuthUser() user: User): Promise<any> {
    return this.usersService.getIncome(user);
  }

  @Post('/me/agreement')
  async setAgreement(@AuthUser() user: User, @Body() body: SetAgreementDto) {
    return this.usersService.setAgreement(user.id, body);
  }

  @Post('/me/upload')
  @UseInterceptors(FileInterceptor('photo'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Photo to upload',
    type: PhotoUploadDto,
  })
  async uploadPhoto(@Req() req: any, @UploadedFile() photo: FileUploadDto): Promise<any> {
    return this.usersService.uploadPhoto(req.user.id, photo);
  }

  @Post('/me/fake-deposit')
  async fakeDeposit(@Req() req: any): Promise<any> {
    const userId = req.user.id;
    const user = await this.usersService.findById(userId);

    return this.packagesService.buyPackage(user, Levels.Level1);
  }

  @Get('/me/team')
  async getTeamInfo(@Req() req: any): Promise<any> {
    const userId = req.user.id;

    return this.usersService.getTeamInfo(userId);
  }

  @Get('/me/team/income')
  @ApiQuery({ name: 'level', enum: Levels, example: '1' })
  @ApiQuery({ name: 'from', type: Date, example: '2001-01-01' })
  @ApiQuery({ name: 'to', type: Date, example: '2100-01-01' })
  async getPartnersInfo(
    @Req() req: any,
    @Query('level', new EnumValidationPipe(Levels)) level: Levels,
    @Query('from') from: Date,
    @Query('to') to: Date,
  ): Promise<any> {
    const userId = req.user.id;
    return this.usersService.getPartnersIncome(userId, level, from, to);
  }

  @Get('/me/team/partners')
  async getPartners(@Req() req: any): Promise<any> {
    const userId = req.user.id;
    const user = await this.usersService.getUser(userId);

    const referrals = await this.usersService.getReferrals(user.partnerId);

    return plainToInstance(PartnerDto, referrals, {
      excludeExtraneousValues: true,
    });
  }

  @Post('/')
  async createUser(@Req() req, @Body() body: CreateUserDto): Promise<UserDto> {
    if (!req.user.isAdmin) throw new UnauthorizedException();
    const user = await this.usersService.createUser(body);
    return UserDto.create(user);
  }

  @Put('/:id')
  async updateUser(
    @Req() req: RequestWithUser,
    @Body() body: UpdateUserDto,
    @Param('id', ParseIntPipe) id: string,
  ): Promise<UserDto> {
    if (req.user.id !== +id) if (!req.user.isAdmin) throw new UnauthorizedException();

    if (!req.user.isAdmin) body.isAdmin = req.user.isAdmin;
    const user = await this.usersService.updateUser(id, body);

    if (!user) {
      throw new NotFoundException();
    }

    return UserDto.create(user);
  }

  @Get('/me/profile')
  @UseGuards(RoleGuard)
  async getUserProfile(@AuthUser() user: User) {
    return this.usersService.getUserProfileData(user);
  }

  @Post('/me/defaultWallet')
  async updateDefaultWalletNumber(@AuthUser() user: User, @Body() body: UpdateWalletDto) {
    console.log('START UPDATE DEFAULT WALLET');

    const updatedUser = await this.usersService.updateUser(user.id, body);

    console.log('FINISH PROMISE DEFAUT WALLET');

    return ProfileUserDto.create(updatedUser);
  }

  @Delete('/:id')
  async removeUser(@Param('id', ParseIntPipe) id: string): Promise<void> {
    return this.remove(id);
  }

  @Get('/team/structure/:partnerId')
  async getTeamUserStructure(
    @Param('partnerId') requestedPartnerId: string,
    @AuthUser() user: User,
  ) {
    const { fullName, partnerId, referrals, teamInfo } = await this.usersService.getUserStructure(
      user,
      requestedPartnerId,
    );
    return {
      fullName,
      partnerId,
      referrals: plainToInstance(PartnerDto, referrals, {
        excludeExtraneousValues: true,
      }),
      teamInfo,
    };
  }
}
