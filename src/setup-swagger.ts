import type { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): string {
  const configService = app.get(ConfigService);
  const port = configService.get('app.port');
  const prefix = configService.get('app.apiPrefix');

  const options = new DocumentBuilder()
    .setTitle(configService.get('app.name'))
    .setDescription(configService.get('app.description'))
    .setVersion(configService.get('app.version'))
    .addBearerAuth({
      type: 'http',
      description: 'Can be received at `/auth/login` endpoint',
      name: 'accessToken',
      in: `/${prefix}/auth/login`,
    })
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup(`${prefix}/docs`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  return `Swagger: http://localhost:${port}/${prefix}/docs`;
}
