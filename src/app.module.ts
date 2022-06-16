import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, TransactionsModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
