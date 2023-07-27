import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { MailService } from 'src/mail/mail.service';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
        HttpModule,
        ConfigModule,
        MailerModule.forRootAsync({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                }),
            ],
            useFactory: async (configService: ConfigService) => {
                return {
                    transport: {
                        host: configService.get('mail.host'),
                        port: configService.get('mail.port'),
                        secure: configService.get('mail.secure'),
                        ignoreTLS: configService.get('mail.ignoreTLS'),
                        requireTLS: configService.get('mail.requireTLS'),
                        auth: {
                            user: configService.get('mail.user'),
                            pass: configService.get('mail.password'),
                        },
                    },
                    defaults: {
                        from: `"${configService.get(
                            'mail.defaultName',
                        )}" <${configService.get('mail.defaultEmail')}>`,
                    },
                    template: {
                        dir: configService.get('mail.templatesDir'),
                        adapter: new EjsAdapter({
                            inlineCssEnabled: true,
                        }),
                        options: {
                            strict: true,
                        },
                    },
                };
            },
            inject: [ConfigService],
        }),
    ],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {}
