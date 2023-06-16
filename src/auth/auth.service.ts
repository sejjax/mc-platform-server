import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { UsersService } from 'src/users/users.service';
import { ForgotService } from 'src/forgot/forgot.service';
import { MailService } from 'src/mail/mail.service';
import { LoginDto } from 'src/auth/dto/login.dto';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { UpdateDto } from 'src/auth/dto/update.dto';
import { ProfileUserDto } from 'src/auth/dto/profile-user.dto';
import { filterObjectDto } from 'src/utils/filters/filterObjectDto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private forgotService: ForgotService,
    private mailService: MailService,
  ) {}

  async validateLogin(login: LoginDto): Promise<{ accessToken: string; user: ProfileUserDto }> {
    const user = await this.usersService.getUserByIdentifier(login);

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'incorrectIdentifierOrPassword',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user.hash) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'notConfirmedEmail',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const isValidPassword = await bcrypt.compare(login.password, user.password);

    if (isValidPassword) {
      const accessToken = await this.jwtService.signAsync(JSON.parse(JSON.stringify(user)));
      const baseDepositLevel = await this.usersService.getCurrentBasePackage(user);
      const { needToAllStructure, needToFirstStructure } =
        await this.usersService.getToTheNextLevelData(user.id, user.level);

      return {
        accessToken,
        user: {
          baseDepositLevel,
          ...ProfileUserDto.create(user),
          investorLevel: user.investor_level,
          needToAllStructure,
          needToFirstStructure,
          role: { ...user.role, access: JSON.parse(user.role?.access ?? '[]') },
        },
      };
    } else {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'incorrectIdentifierOrPassword',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async register(register: RegisterDto): Promise<void> {
    const hash = crypto.createHash('sha256').update(randomStringGenerator()).digest('hex');
    if (!register.referrerId) {
      register.referrerId = 'HF7LTH';
    }

    await this.usersService.createUserByConfirm({
      ...register,
      isAdmin: false,
      hash,
      callback: async (user) => {
        // await this.mailService.confirmEmail({
        //   to: user.email,
        //   data: {
        //     hash,
        //   },
        // });
        try {
          await this.mailService.confirmEmailProxy({
            hash,
            to: user.email,
          });
        } catch (error) {
          throw new InternalServerErrorException({ message: 'Email Service Error' });
        }
      },
    });
  }

  async confirmEmail(hash: string): Promise<void> {
    const user = await this.usersService.findOne({ hash });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'notFound',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    user.hash = null;

    await this.usersService.update(user.id, user);
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findOne({ email: email.toLowerCase().trim() });

    if (user && user.hash) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'notConfirmedEmail',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'incorrectEmail',
        },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const hash = crypto.createHash('sha256').update(randomStringGenerator()).digest('hex');

      await this.forgotService.createForgot({
        hash,
        user,
      });

      // await this.mailService.forgotPassword({
      //   to: email,
      //   data: {
      //     hash,
      //   },
      // });
      await this.mailService.forgotPasswordProxy({
        to: email,
        hash,
      });
    }
  }

  async resetPassword(hash: string, password: string): Promise<void> {
    const forgot = await this.forgotService.findOne({ hash });

    if (!forgot) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          errors: {
            hash: 'notFound',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const user = forgot.user;
    user.password = password;

    await this.usersService.create(user);
    await this.forgotService.remove(forgot.id);
  }

  async update({ id }: User, payload: UpdateDto): Promise<ProfileUserDto> {
    const filteredPayload = filterObjectDto<UpdateDto>(payload, [
      'agreement',
      'country',
      'fullName',
      'isAdmin',
      'mobile',
      'oldPassword',
      'password',
      'photo',
    ]);
    if (filteredPayload.password) {
      if (filteredPayload.oldPassword) {
        const currentUser = await this.usersService.getUser(id);

        const isValidOldPassword = await bcrypt.compare(
          filteredPayload.oldPassword,
          currentUser.password,
        );

        if (!isValidOldPassword) {
          throw new HttpException(
            {
              status: HttpStatus.BAD_REQUEST,
              errors: {
                oldPassword: 'incorrectOldPassword',
              },
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      } else {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            errors: {
              oldPassword: 'missingOldPassword',
            },
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const user = await this.usersService.update(id, {
      ...filteredPayload,
    });

    return ProfileUserDto.create(user);
  }

  async getUserReferralName(referralId: string): Promise<{ name: string | null }> {
    const user = await this.usersService.findByPartnerId(referralId);
    if (!user) return { name: null };
    return { name: user.fullName };
  }
}
