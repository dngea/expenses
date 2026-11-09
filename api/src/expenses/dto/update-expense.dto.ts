import { CreateExpenseDto } from './create-expense.dto.js';
import { PartialType } from '@nestjs/mapped-types';

// PartialType marks everything as optional
export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {}
