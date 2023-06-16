import { Injectable } from '@nestjs/common';
import { Decimal } from 'decimal.js-light';
import { Accrual } from './accrual.entity';
import { Accruals } from './consts';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Injectable()
export class AccrualsService {
  constructor(private usersService: UsersService) {}

  async generateAccruals(
    user: User,
    packageCost: string | number,
  ): Promise<Pick<Accrual, 'sourceUser' | 'targetUser' | 'value' | 'line'>[]> {
    const maxAccrualLevel = Math.max(...Accruals.map(({ length }) => length));
    const referrers = await this.usersService.getReferrers(
      user.referrerId,
      maxAccrualLevel,
    );

    const accruals: Pick<
      Accrual,
      'sourceUser' | 'targetUser' | 'value' | 'line'
    >[] = [];

    // let sourceUser = user;

    // for (const [line, referrer] of referrers.entries()) {
    //   const accrualPercent = Accruals[sourceUser.referrerLevel][line];

    //   let value: string;

    //   if (!accrualPercent) {
    //     value = '0';

    //     // if user stopped participating
    //   } else if (!referrer.level) {
    //     value = '0';
    //   } else {
    //     value = new Decimal(packageCost)
    //       .mul(accrualPercent)
    //       .div(100)
    //       .toString();
    //   }

    //   accruals.push({
    //     sourceUser,
    //     targetUser: referrer,
    //     value,
    //     line,
    //   });

    //   sourceUser = referrer;
    // }

    return accruals;
  }
}
