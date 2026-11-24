import { PartialType } from '@nestjs/mapped-types';
import { CreateRecurringMovementDto } from './create-recurring-movements.dto.js';

export class UpdateRecurringMovementsDto extends PartialType(
  CreateRecurringMovementDto,
) {}
