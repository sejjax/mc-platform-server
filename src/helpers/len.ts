export const len = <T>(val: T[] | string | Set<T> | Iterable<T>) => {
    if(Array.isArray(val) || typeof val === "string")
        return val.length
    if(val instanceof Set)
        return val.size
    return [...val].length
}