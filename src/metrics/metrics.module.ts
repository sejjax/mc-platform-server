import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesService } from 'src/files/files.service';
import { CalculationsService } from 'src/user/calculations/calculations.service';
import { Calculation } from 'src/user/calculations/entities/calculation.entity';
import { Deposit } from 'src/user/deposit/entities/deposit.entity';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';

@Module({
    imports: [TypeOrmModule.forFeature([User, Deposit, Calculation]), HttpModule],
    providers: [MetricsService, UsersService, FilesService, CalculationsService],
    controllers: [MetricsController],
})
export class MetricsModule {}
