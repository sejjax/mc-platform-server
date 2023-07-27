import { NestFactory, Reflector } from '@nestjs/core';
//import helmet from 'helmet';
import * as morgan from 'morgan';
import * as compression from 'compression';
import RateLimit from 'express-rate-limit';
import { setupSwagger } from 'src/setup-swagger';
import { HttpExceptionFilter } from 'src/utils/filters/bad-request.filter';
import { QueryFailedFilter } from 'src/utils/filters/query-failed.filter';
import { AppModule } from 'src/app/app.module';
import { ConfigService } from '@nestjs/config';
import {
    ClassSerializerInterceptor,
    HttpStatus,
    Logger,
    UnprocessableEntityException,
    ValidationPipe,
} from '@nestjs/common';
import { GoogleRecaptchaFilter } from './utils/filters/google-recaptcha.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);

    //app.use(helmet());
    app.use(
        RateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 1000, // limit each IP to 100 requests per windowMs
            handler: (request, response) => {
                return response.status(501).send({
                    statusCode: 501,
                    error: 'Too many requests',
                    message: 'Too many requests',
                });
            },
        }),
    );
    app.use(compression());
    app.use(morgan('combined'));
    app.enableCors({
        origin: true,
        credentials: true,
    });
    app.enableShutdownHooks();
    app.setGlobalPrefix(configService.get('app.apiPrefix'), {
        exclude: ['/'],
    });
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: false,
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            transform: true,
            dismissDefaultMessages: true,
            exceptionFactory: (errors) => new UnprocessableEntityException(errors),
        }),
    );
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

    const reflector = app.get(Reflector);
    app.useGlobalFilters(
        new HttpExceptionFilter(reflector),
        new QueryFailedFilter(reflector),
        new GoogleRecaptchaFilter(),
    );

    let swaggerInfo = 'Swagger disabled in production env!';
    if (configService.get('app.useSwagger')) {
        swaggerInfo = setupSwagger(app);
    }

    await app.listen(configService.get('app.port')).then(() => {
        Logger.debug(
            `App started at http://localhost:${configService.get('app.port')}/${configService.get(
                'app.apiPrefix',
            )}`,
        );
        Logger.debug(
            `Compodoc: http://localhost:${configService.get('app.port')}/${configService.get(
                'app.apiPrefix',
            )}/compodoc`,
        );
        Logger.debug(swaggerInfo);
    });
}

void bootstrap();
