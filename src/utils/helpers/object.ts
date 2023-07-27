export const peek = (obj: object, fields: string[]): object => {
    const newObj = {};
    fields.forEach(field => newObj[field] = obj[field]);
    return newObj;
};

export const omit = (obj: object, fields: string[]): object => {
    const newObj = {...obj};
    fields.forEach(field => delete newObj[field]);
    return newObj;
};

export const peekOmit = (obj: object, fields: string[]): object[] => {
    return [peek(obj, fields), omit(obj, fields)];
};