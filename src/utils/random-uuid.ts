import { customAlphabet } from 'nanoid/async';

export const randomUuid = async (size: number): Promise<string> => {
    const random = customAlphabet('ABCDFGHJKLMNPQRSTVXZ0123456789', size);

    return random();
};
