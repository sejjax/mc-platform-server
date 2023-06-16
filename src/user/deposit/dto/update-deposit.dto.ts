import { PartialType } from '@nestjs/swagger';
import { CreateDepositDto } from 'src/user/deposit/dto/create-deposit.dto';

export class UpdateDepositDto extends PartialType(CreateDepositDto) {}
