import { PartialType } from '@nestjs/swagger';
import { CreateBuyProjectTokensDto } from 'src/user/buy-project-tokens/dto/create-buy-project-tokens.dto';

export class UpdateBuyProjectTokensDto extends PartialType(
  CreateBuyProjectTokensDto,
) {}
