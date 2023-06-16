import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/mail/mail.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { Calculation } from 'src/user/calculations/entities/calculation.entity';
import { User } from 'src/users/user.entity';
import { ChangeDefaultWalletAddressController } from './change-default-wallet-addr.controller';
import { ChangeDefaultWalletAddr } from './change-default-wallet-addr.entity';
import { ChangeDefaultWalletAddressService } from './change-default-wallet-addr.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChangeDefaultWalletAddr, User, Calculation]),
    MailModule,
    NotificationsModule,
  ],
  controllers: [ChangeDefaultWalletAddressController],
  providers: [ChangeDefaultWalletAddressService],
})
export class ChangeDefaultWalletAddressModule {}
