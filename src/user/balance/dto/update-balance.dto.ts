import { PartialType } from '@nestjs/swagger';
import { CreateBalanceDto } from 'src/user/balance/dto/create-balance.dto';

export class UpdateBalanceDto extends PartialType(CreateBalanceDto) {}
