import { Module } from '@nestjs/common';
import { RecurringMovementsService } from './recurring-movements.service.js';
import { RecurringMovementsController } from './recurring-movements.controller.js';
import { DatabaseModule } from '../database/database.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [RecurringMovementsService],
  controllers: [RecurringMovementsController],
})
export class RecurringMovementsModule {}
