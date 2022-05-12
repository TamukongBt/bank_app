import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Transaction } from '@prisma/client';
import { TransactionsService } from './transactions.service';
@ApiTags('Transactions Module')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionService: TransactionsService) {}

  @Get(':id')
  async getTransactionById(@Param('id') id: string): Promise<Transaction> {
    return this.transactionService.getTransactionById({ id: id });
  }
  @Get('/')
  async getAllTransactions(
    @Body()
    data,
  ): Promise<Transaction[]> {
    return this.transactionService.getAllTransactions(data);
  }

  @Post('/')
  async createTransaction(
    @Body()
    data,
  ): Promise<Transaction> {
    return this.transactionService.createTransaction(data);
  }

  @Put(':id')
  async updateTransaction(
    @Param('id') id: string,
    @Body()
    data,
  ): Promise<Transaction> {
    return this.transactionService.updateTransaction({
      where: { id: id },
      data: data,
    });
  }

  @Delete(':id')
  async deleteTransaction(@Param('id') id: string): Promise<Transaction> {
    return this.transactionService.deleteTransaction({
      id: id,
    });
  }
}
