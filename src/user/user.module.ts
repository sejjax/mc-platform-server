import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyProjectTokensController } from 'src/user/buy-project-tokens/buy-project-tokens.controller';
import { BuyProjectTokensService } from 'src/user/buy-project-tokens/buy-project-tokens.service';
import { BuyProjectTokens } from 'src/user/buy-project-tokens/entities/buy-project-tokens.entity';
import { DepositController } from 'src/user/deposit/deposit.controller';
import { DepositService } from 'src/user/deposit/deposit.service';
import { Deposit } from 'src/user/deposit/entities/deposit.entity';
import { WithdrawHistory } from 'src/user/withdraw-history/entities/withdraw-history.entity';
import { WithdrawHistoryController } from 'src/user/withdraw-history/withdraw-history.controller';
import { WithdrawHistoryService } from 'src/user/withdraw-history/withdraw-history.service';
import { UsersService } from 'src/users/users.service';
import { FilesService } from 'src/files/files.service';
import { Balance } from 'src/user/balance/entities/balance.entity';
import { BalanceService } from 'src/user/balance/balance.service';
import { BalanceController } from 'src/user/balance/balance.controller';
import { WalletHistory } from 'src/user/wallet-history/entities/wallet-history.entity';
import { WalletHistoryService } from 'src/user/wallet-history/wallet-history.service';
import { WalletHistoryController } from 'src/user/wallet-history/wallet-history.controller';
import { Calculation } from './calculations/entities/calculation.entity';
import { CalculationsService } from './calculations/calculations.service';
import { CalculationsController } from './calculations/calculations.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Balance,
            WalletHistory,
            Deposit,
            WithdrawHistory,
            BuyProjectTokens,
            Calculation,
        ]),
    ],
    controllers: [
        BalanceController,
        WalletHistoryController,
        DepositController,
        WithdrawHistoryController,
        BuyProjectTokensController,
        CalculationsController,
    ],
    providers: [
        UsersService,
        BalanceService,
        FilesService,
        WalletHistoryService,
        DepositService,
        WithdrawHistoryService,
        BuyProjectTokensService,
        CalculationsService,
    ],
})
export class UserModule {}
