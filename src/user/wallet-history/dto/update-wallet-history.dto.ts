import { PartialType } from '@nestjs/swagger';
import { CreateWalletHistoryDto } from 'src/user/wallet-history/dto/create-wallet-history.dto';

export class WalletHistoryDto extends PartialType(CreateWalletHistoryDto) {}
