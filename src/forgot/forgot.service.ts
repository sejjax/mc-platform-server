import { Injectable } from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { Forgot } from './forgot.entity';
import { BaseEntityService } from '../base/base-entity.service';
import { User } from '../users/user.entity';

export interface ForgotFilter {
  hash?: string;
  user?: User;
}

@Injectable()
export class ForgotService extends BaseEntityService<Forgot, ForgotFilter> {
    constructor() {
        super(Forgot);
    }

    async createForgot(body: DeepPartial<Forgot>): Promise<void> {
        const entityManager = this.connection.createEntityManager();

        const forgot = entityManager.create(Forgot, body);

        await entityManager.save(forgot);
    }
}
