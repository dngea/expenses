import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { CategoriesModule } from './categories/categories.module.js';
import { DatabaseModule } from './database/database.module.js';
import { ExpensesModule } from './expenses/expenses.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [CategoriesModule, DatabaseModule, ExpensesModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
