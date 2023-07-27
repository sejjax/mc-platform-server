import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { ChangeDefaultWalletAddr } from './change-default-wallet-addr.entity';
import { ChangeDefaultWalletAddrInputDto } from './dto/change-default-wallet-addr-input.dto';
import * as crypto from 'crypto';
import { MailService } from 'src/mail/mail.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Calculation } from 'src/user/calculations/entities/calculation.entity';
import { Status } from 'src/user/calculations/calculations.types';

@Injectable()
export class ChangeDefaultWalletAddressService {
    constructor(
    @InjectRepository(ChangeDefaultWalletAddr)
    private walletAddrRepo: Repository<ChangeDefaultWalletAddr>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private mailService: MailService,
    private notificationsService: NotificationsService,
    @InjectRepository(Calculation) private calculationsRepo: Repository<Calculation>,
    ) {}

    async changeDefaultWalletAddr(inputData: ChangeDefaultWalletAddrInputDto, user: User) {
        const dbUser = await this.userRepo
            .createQueryBuilder('user')
            .where('id = :userId', { userId: user.id })
            .select(['email', 'default_wallet_address'])
            .getRawOne();
        const confirmation_token_expiration = new Date();
        confirmation_token_expiration.setHours(confirmation_token_expiration.getHours() + 12);

        const hash = crypto.randomBytes(20).toString('hex');
        const dbRow = await this.walletAddrRepo.save({
            new_wallet: inputData.new_wallet,
            old_wallet: dbUser.default_wallet_address,
            confirmation_token: hash,
            confirmation_token_expiration: confirmation_token_expiration.toString(),
            user,
        });
        // this.mailService.changeWalletAddr({
        //   data: { hash, new_wallet: dbRow.new_wallet, old_wallet: dbRow.old_wallet },
        //   to: dbUser.email,
        // });
        this.mailService.changeWalletAddrProxy({
            hash,
            new_wallet: dbRow.new_wallet,
            old_wallet: dbRow.old_wallet,
            to: dbUser.email,
        });
        return { id: dbRow.id };
    }

    async confirmChangeWallet(hash: string) {
        const changeRow = await this.walletAddrRepo.findOne({
            where: {
                confirmation_token: hash,
            },
            relations: ['user'],
        });
        if (!changeRow || changeRow.confirmation_date)
            throw new BadRequestException('Подтверждение не найдено или уже подтверждено');
        if (new Date().getTime() > new Date(changeRow.confirmation_token_expiration).getTime())
            throw new BadRequestException('Срок действия подтверждения истек');
        await this.userRepo
            .createQueryBuilder()
            .update()
            .set({
                default_wallet_address: changeRow.new_wallet,
            })
            .where('id = :userId', { userId: changeRow.user.id })
            .execute();
        await this.walletAddrRepo
            .createQueryBuilder()
            .update()
            .set({ confirmation_date: new Date().toString() })
            .where('id = :id', { id: changeRow.id })
            .execute();
        await this.notificationsService.addNotification({
            isEmail: false,
            isSite: true,
            notification_date: new Date().toString(),
            notification_type: 2,
            whom_notify: [changeRow.user.id.toString()],
            notification_title: 'Смена кошелька выплат',
            notification_text: `Вы изменили адрес кошелька по умолчанию на адрес ${changeRow.new_wallet}`,
        });
        await this.calculationsRepo
            .createQueryBuilder('calculation')
            .update()
            .set({ wallet_addr: changeRow.new_wallet })
            .where('"userId" = :userId', { userId: changeRow.user.id })
            .andWhere('status = :status', { status: Status.waiting })
            .execute();
        return { success: true, default_wallet_address: changeRow.new_wallet };
    }
}
