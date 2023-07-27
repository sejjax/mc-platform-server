import { lengthOf } from './lengthOf';

export const isEmpty = <T>(val: string | T[] | Set<T> | Iterable<T>) =>
    lengthOf(val) === 0;