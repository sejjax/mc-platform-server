export const clean = (obj: object) => Object.fromEntries(Object.entries(obj).filter(
    keyValue => keyValue[1] != null
));