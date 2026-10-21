import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { CategoriesModule } from './categories/categories.module.js';
import { DatabaseModule } from './database/database.module.js';
import { ExpensesModule } from './expenses/expenses.module.js';

@Module({
  imports: [CategoriesModule, DatabaseModule, ExpensesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
