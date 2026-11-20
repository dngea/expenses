import { Module } from '@nestjs/common';
import { MovementsController } from './movements.controller.js';
import { MovementsService } from './movements.service.js';
import { DatabaseModule } from '../database/database.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [MovementsController],
  providers: [MovementsService],
})
export class MovementModule {}
