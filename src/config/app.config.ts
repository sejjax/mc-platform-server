import { registerAs } from '@nestjs/config';

import { version, name, description } from 'src/../package.json';

export default registerAs('app', () => ({
    nodeEnv: process.env.NODE_ENV,
    name: name,
    port: parseInt(process.env.APP_PORT || process.env.PORT, 10) || 4000,
    apiPrefix: process.env.API_PREFIX || 'api',
    description: description,
    version: version,
    useSwagger: process.env.USE_SWAGGER || true,
}));
