import { Injectable } from '@nestjs/common';
import { Accrual } from './accrual.entity';

@Injectable()
export class AccrualsService {
    constructor() {}

    async generateAccruals(): Promise<Pick<Accrual, 'sourceUser' | 'targetUser' | 'value' | 'line'>[]> {
        return [];
    }
}
