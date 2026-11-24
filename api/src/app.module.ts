import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { CategoriesModule } from './categories/categories.module.js';
import { DatabaseModule } from './database/database.module.js';
import { MovementModule } from './movements/movements.module.js';
import { AuthModule } from './auth/auth.module.js';
import { HealthModule } from './health/health.module.js';
import { RecurringMovementsModule } from './recurring-movements/recurring-movements.module.js';

@Module({
  imports: [
    CategoriesModule,
    DatabaseModule,
    MovementModule,
    AuthModule,
    HealthModule,
    RecurringMovementsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
