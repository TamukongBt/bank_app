import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { Transaction, Prisma } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async getTransactionById(
    transactionWhereUniqueInput: Prisma.TransactionWhereUniqueInput,
  ): Promise<Transaction | null> {
    return this.prisma.transaction.findUnique({
      where: transactionWhereUniqueInput,
      include: { user: true },
    });
  }

  async getAllTransactions(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TransactionWhereUniqueInput;
    where?: Prisma.TransactionWhereInput;
    orderBy?: Prisma.TransactionOrderByWithRelationInput;
  }): Promise<Transaction[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.transaction.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: { user: true },
    });
  }

  async getAllTransactionsByUserId(userId): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: { userId },
      include: { user: true },
    });
  }

  async createTransaction(
    data: Prisma.TransactionCreateInput,
  ): Promise<Transaction> {
    return this.prisma.transaction.create({
      data,
    });
  }

  async updateTransaction(params: {
    where: Prisma.TransactionWhereUniqueInput;
    data: Prisma.TransactionUpdateInput;
  }): Promise<Transaction> {
    const { where, data } = params;
    return this.prisma.transaction.update({
      data,
      where,
    });
  }

  async deleteTransaction(
    where: Prisma.TransactionWhereUniqueInput,
  ): Promise<Transaction> {
    return this.prisma.transaction.delete({
      where,
    });
  }
}
