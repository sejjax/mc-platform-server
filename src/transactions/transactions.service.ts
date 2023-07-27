import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvestorLevel } from 'src/users/consts';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/CreateTransaction.dto';
import { Transaction, TransactionStatusEnum } from './transaction.entity';
import { UsersService } from 'src/users/users.service';
import { isBasicDeposit, isInvestorProDeposit } from 'src/utils/helpers/deposits';
import { DepositService } from 'src/user/deposit/deposit.service';
import { investorProAllLimit, investorProPerUserLimit } from 'src/constants/deposit.contants';

@Injectable()
export class TransactionsService {
    constructor(
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
    private usersService: UsersService,
    private depositService: DepositService,
    ) {}

    async createTransaction(data: CreateTransactionDto, user: User) {
        if (isBasicDeposit(data.product_service_description)) {
            const depositLevel = parseInt(data.product_service_description.replace('basic', ''));
            const userBaseDepositLevel = await this.usersService.getCurrentBasePackage(user);
            if (depositLevel <= userBaseDepositLevel)
                throw new BadRequestException(
                    'Нельзя приобрести базовый пакет уровнем ниже приобретенного ранее',
                );
        }

        if (isInvestorProDeposit(data.product_service_description)) {
            const { allPackages, perUser } = await this.depositService.getInvestorProAmountByUser(
                user.id,
            );
            if (allPackages >= investorProAllLimit || perUser >= investorProPerUserLimit)
                throw new BadRequestException('Investor Pro Limit');
        }

        const transaction = await this.transactionRepo.save({
            amount: data.amount.toString(),
            product_service_description: data.product_service_description,
            wallet_addr: data.wallet_addr,
            user,
        });
        delete transaction.user;
        return transaction;
    }

    async checkTransaction(user: User, transactionId: number) {
        const transaction: {
      id: number;
      userId: number;
      status: TransactionStatusEnum;
      investorLevel: InvestorLevel;
    } = await this.transactionRepo
        .createQueryBuilder('transaction')
        .leftJoinAndSelect('transaction.user', 'user', 'user.id = transaction.userId')
        .where('transaction.id = :transactionId', { transactionId })
        .select([
            'transaction.id as id',
            'transaction.status',
            'user.id as "userId"',
            'user.investor_level as "investorLevel"',
        ])
        .getRawOne();
        transaction.investorLevel = +transaction.investorLevel;
        if (transaction.userId !== user.id) throw new ForbiddenException();

        return transaction;
    }
}
