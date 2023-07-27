import { PartialType } from '@nestjs/swagger';
import { CreateWithdrawHistoryDto } from 'src/user/withdraw-history/dto/create-withdraw-history.dto';

export class UpdateWithdrawHistoryDto extends PartialType(
    CreateWithdrawHistoryDto,
) {}
