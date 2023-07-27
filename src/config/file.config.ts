import { registerAs } from '@nestjs/config';

export default registerAs('file', () => ({
    maxFileSize: 7168880, // 7mb
}));
