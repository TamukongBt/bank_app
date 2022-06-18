import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { PrismaService } from 'src/services/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [TransactionsService, PrismaService, JwtService],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
