import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { TransactionsModule } from './modules/transactions/transactions.module';

@Module({
  imports: [UserModule, TransactionsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
