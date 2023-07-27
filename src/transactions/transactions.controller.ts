import { Body, Controller, Post, UseGuards, Get, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { User } from 'src/users/user.entity';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import { CreateTransactionDto } from './dto/CreateTransaction.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
@UseGuards(AuthGuard('jwt'))
@ApiTags('Transactions')
@ApiBearerAuth()
export class TransactionsController {
    constructor(private transactionsService: TransactionsService) {}

  @Post()
    async createTransaction(@AuthUser() user: User, @Body() body: CreateTransactionDto) {
        return this.transactionsService.createTransaction(body, user);
    }

  @Get()
  async checkTransaction(@AuthUser() user: User, @Query('transactionId') transactionId: string) {
      return this.transactionsService.checkTransaction(user, +transactionId);
  }
}
