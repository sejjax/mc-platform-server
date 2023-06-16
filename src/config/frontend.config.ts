import { registerAs } from '@nestjs/config';

export default registerAs('frontend', () => ({
  baseUrl: process.env.APP_FRONTEND_BASE_URL,
}));
