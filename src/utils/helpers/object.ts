export const peek = (obj: Object, fields: string[]): object => {
    return {}
}

export const omit = (obj: Object, fields: string[]): object => {
    return {}
}

export const peekOmit = (obj: Object, fields: string[]): object[] => {
    return [peek(obj, fields), omit(obj, fields)]
}