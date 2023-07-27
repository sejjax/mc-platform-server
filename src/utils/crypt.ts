import * as crypto from 'crypto';

export const encrypt = (data: string, key: string) => {
    const cipher = crypto.createCipheriv('aes-256-ecb', key, null);
    return Buffer.concat([cipher.update(data), cipher.final()]).toString('base64');
};
