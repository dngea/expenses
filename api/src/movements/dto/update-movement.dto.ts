import { CreateMovementDto } from './create-movement.dto.js';
import { PartialType } from '@nestjs/mapped-types';

// PartialType marks everything as optional
export class UpdateMovementDto extends PartialType(CreateMovementDto) {}
