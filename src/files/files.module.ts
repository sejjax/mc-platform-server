import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './file.entity';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MulterConfigService } from './multer-config.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  controllers: [FilesController],
  providers: [ConfigModule, ConfigService, FilesService],
})
export class FilesModule {}
