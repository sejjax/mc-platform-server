import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { RequestWithUser } from 'src/utils/interfaces/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { ConfirmDto } from './dto/confirm.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { RegisterDto } from './dto/register.dto'
import { UpdateDto } from './dto/update.dto'
import { Recaptcha } from '@nestlab/google-recaptcha'

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(public authService: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() login: LoginDto) {
    return this.authService.validateLogin(login)
  }

  @Post('/register')
  // @Recaptcha({
  //   response: (req) => req.body.recaptcha,
  //   action: 'register',
  // })
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUser: RegisterDto) {
    return this.authService.register(createUser);
  }

  @Post('/confirm')
  @HttpCode(HttpStatus.OK)
  async confirmEmail(@Body() confirmEmail: ConfirmDto) {
    return this.authService.confirmEmail(confirmEmail.hash);
  }

  @Post('/forgot/password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPassword: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPassword.email);
  }

  @Post('/reset/password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPassword: ResetPasswordDto) {
    return this.authService.resetPassword(resetPassword.hash, resetPassword.password);
  }

  @Patch('/me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  public async update(@Req() req: RequestWithUser, @Body() payload: UpdateDto) {
    if (!req.user.isAdmin) payload.isAdmin = req.user.isAdmin;
    return this.authService.update(req.user, payload);
  }

  @Get('/referral')
  async getReferralName(@Query('referralId') referralId: string): Promise<{ name: string | null }> {
    return this.authService.getUserReferralName(referralId);
  }
}
