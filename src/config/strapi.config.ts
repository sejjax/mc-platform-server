import { registerAs } from '@nestjs/config';

export default registerAs('strapi', () => ({
    apiUrl: process.env.STRAPI_API_URL,
}));
