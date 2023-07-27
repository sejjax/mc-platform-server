import {
    appConfig,
    authConfig,
    mailConfig,
    databaseConfig,
    frontendConfig,
    fileConfig,
    strapiConfig
} from 'src/config';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/database/database.module';
import { MailModule } from 'src/mail/mail.module';
import { AuthModule } from 'src/auth/auth.module';
import { FilesModule } from 'src/files/files.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { UserModule } from 'src/user/user.module';
import { TransactionModule } from 'src/transactions/transactions.module';
import { MetricsModule } from 'src/metrics/metrics.module';
import { ChangeDefaultWalletAddressModule } from 'src/change-default-wallet-addr/change-default-wallet-addr.module';
import { PromotionModule } from 'src/promotion/promotion.module';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            serveRoot: '/api/compodoc',
            rootPath: join(__dirname, '..', 'docs'),
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            load: [
                appConfig,
                authConfig,
                mailConfig,
                databaseConfig,
                frontendConfig,
                fileConfig,
                strapiConfig
            ],
        }),
        FilesModule,
        AuthModule,
        DatabaseModule,
        MailModule,
        NotificationsModule,
        UserModule,
        TransactionModule,
        MetricsModule,
        ChangeDefaultWalletAddressModule,
        PromotionModule,
    ],
})
export class AppModule {
}
