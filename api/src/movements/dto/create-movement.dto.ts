import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  matches,
  Matches,
} from 'class-validator';

export class CreateMovementDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @IsPositive()
  amount: number;

  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  category_id: number;

  @IsDateString({ strict: true })
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date entered must have a valid format yyyy-mm-dd',
  })
  spent_at: string;

  @IsString()
  @IsOptional()
  description?: string;
}
