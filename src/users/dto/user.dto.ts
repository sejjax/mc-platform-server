import { Expose } from 'class-transformer';
import { BaseEntityDto } from 'src/base/base-entity.dto';
import { User } from '../user.entity';

export class UserDto extends BaseEntityDto<User, UserDto>() {
  @Expose() id: number;
  @Expose() email: string;
  @Expose() partnerId: string;
}
