import { BadRequestException, Injectable } from '@nestjs/common';
import Decimal from 'decimal.js-light';
import { EntityManager } from 'typeorm';
import { Accrual } from './accrual.entity';
import { AccrualsService } from './accruals.service';
import { Levels, Packages } from './consts';
import { Package } from './package.entity';
import { User } from './user.entity';

@Injectable()
export class PackagesService {
  constructor(
    private entityManager: EntityManager,
    private accrualsService: AccrualsService,
  ) {}

  async buyPackage(user: User, level: Levels) {
    const packageCost = Packages[level];

    await this.entityManager.transaction(async (entityManager) => {
      const currentUserState = await entityManager.findOne(User, user.id);

      // currentUserState.deposit = new Decimal(currentUserState.deposit)
      //   .minus(packageCost)
      //   .toString();

      // if (new Decimal(currentUserState.deposit).cmp(0) === -1) {
      //   throw new BadRequestException('Insufficient balance');
      // }

      await entityManager.save(currentUserState);

      const pkg = entityManager.create(Package, {
        user,
        level,
        cost: packageCost.toString(),
      });

      await entityManager.save(pkg);

      const accruals = await this.accrualsService.generateAccruals(
        user,
        packageCost,
      );

      for (const accrual of accruals) {
        const currentReferrerState = await entityManager.findOne(
          User,
          accrual.targetUser.id,
        );

        // currentReferrerState.deposit = new Decimal(currentReferrerState.deposit)
        //   .add(accrual.value)
        //   .toString();

        await entityManager.save(currentReferrerState);

        const accrualRecord = entityManager.create(Accrual, {
          ...accrual,
          order: pkg,
        });

        await entityManager.save(accrualRecord);
      }
    });
  }
}
