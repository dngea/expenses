import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class CreateRecurringMovementDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @IsNotEmpty()
  amount: number;

  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  category_id: number;

  @IsDateString({ strict: true })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date entered must have a valid format yyyy-mm-dd',
  })
  start_date: string;

  @IsDateString({ strict: true })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date entered must have a valid format yyyy-mm-dd',
  })
  @IsOptional()
  end_date?: string;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Max(31)
  day_of_repeat: number;

  @IsString()
  @IsOptional()
  description?: string;
}
