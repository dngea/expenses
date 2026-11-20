import { IsDateString, IsIn, IsOptional, Matches } from 'class-validator';

export class ListMovementsQueryDto {
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Not a valid format, must be yyyy-mm-dd',
  })
  @IsDateString({ strict: true })
  @IsOptional()
  from?: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Not a valid format, must be yyyy-mm-dd',
  })
  @IsDateString({ strict: true })
  @IsOptional()
  to?: string;

  @IsIn(['income', 'expense'])
  type: 'income' | 'expense';
}
