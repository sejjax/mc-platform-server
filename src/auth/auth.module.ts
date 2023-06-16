import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';
import { AuthController } from 'src/auth/auth.controller';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { ForgotModule } from 'src/forgot/forgot.module';
import { UsersModule } from 'src/users/users.module';
import { MailModule } from 'src/mail/mail.module';
import { IncomingMessage } from 'http';

@Module({
  imports: [
    MailModule,
    UsersModule,
    ForgotModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('auth.secret'),
        signOptions: {
          expiresIn: configService.get('auth.expires'),
        },
      }),
      inject: [ConfigService],
    }),
    GoogleRecaptchaModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secretKey: configService.get('auth.recaptchaSecret'),
        response: (req: IncomingMessage) =>
          (req.headers.recaptcha || '').toString(),
        actions: ['register'],
        score: 0.8,
        // skipIf: configService.get('app.nodeEnv') !== 'production',
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
