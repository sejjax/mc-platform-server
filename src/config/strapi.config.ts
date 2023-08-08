import { registerAs } from '@nestjs/config';

export default registerAs('strapi', () => ({
    apiUrl: process.env.REACT_APP_STRAPI_PLATFORM_URL,
}));
