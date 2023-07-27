import { Guid } from '../deposit.types';

export const isGuid = (id: string): id is Guid => {
    return id.includes('-');
};