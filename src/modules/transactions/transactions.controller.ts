import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';
import { Transaction, User } from '@prisma/client';
import { TransactionsService } from './transactions.service';
@ApiTags('Transactions Module')
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionService: TransactionsService,
    private readonly jwtService: JwtService,
  ) {}

  @Get(':token')
  async getTransactionById(
    @Param('token') token: string,
  ): Promise<Transaction[]> {
    const user = this.jwtService.decode(token) as User;
    return this.transactionService.getAllTransactionsByUserId(user.id);
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
