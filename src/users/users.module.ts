import { Module } from '@nestjs/common';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AccrualsService } from './accruals.service';
import { PackagesService } from './packages.service';
import { FilesService } from '../files/files.service';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from '../files/multer-config.service';

import { DepositService } from 'src/user/deposit/deposit.service';
import { Deposit } from 'src/user/deposit/entities/deposit.entity';
import { CalculationsService } from 'src/user/calculations/calculations.service';
import { Calculation } from 'src/user/calculations/entities/calculation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Deposit, Calculation]),
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    AccrualsService,
    PackagesService,
    FilesService,
    DepositService,
    CalculationsService,
  ],
  exports: [UsersService, DepositService],
})
export class UsersModule {}
