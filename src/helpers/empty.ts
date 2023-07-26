import { len } from "./len";

export const empty = <T>(val: string | T[] | Set<T> | Iterable<T>) =>
    len(val) === 0