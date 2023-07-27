import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                return {
                    type: 'postgres',
                    host: configService.get('database.host'),
                    port: configService.get('database.port'),
                    username: configService.get('database.username'),
                    password: configService.get('database.password'),
                    database: configService.get('database.name'),
                    entities: [path.join(__dirname, '/../**/*.entity{.ts,.js}')],
                    migrationsTableName: 'migrations',
                    migrations: [path.join(__dirname, '/migrations/*{.ts,.js}')],
                    migrationsRun: !configService.get('database.synchronize'),
                    logging: configService.get('database.synchronize'),
                    synchronize: configService.get('database.synchronize'),
                    ssl: configService.get('nodeEnv') === 'production',
                };
            },
            inject: [ConfigService],
        }),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule {}
