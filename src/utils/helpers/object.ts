export const peek = (obj: Object, fields: string[]): object => {
    const newObj = {};
    fields.forEach(field => newObj[field] = obj[field])
    return newObj;
}

export const omit = (obj: Object, fields: string[]): object => {
    const newObj = {...obj};
    fields.forEach(field => delete newObj[field])
    return newObj;
}

export const peekOmit = (obj: Object, fields: string[]): object[] => {
    return [peek(obj, fields), omit(obj, fields)]
}