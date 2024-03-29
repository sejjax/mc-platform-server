import { isArrayUniq } from './isArrayUniq';

export const formatString = (str: string, args: {[key in string]: string | symbol | number}) => {
    const result = str.matchAll(/(?<=\$)[A-z_]+/g);
    const names = (result ? [...result] : []).map(it => it[0]);
    if(!isArrayUniq(names))
        throw new Error('Key parameters must be uniq');
    names.forEach(name => {
        if(!Object.hasOwn(args, name))
            throw new Error(`Passed value for parameter $${name} expected`);
        str = str.replace(`$${name}`, args[name].toString());
    });
    return str;
};