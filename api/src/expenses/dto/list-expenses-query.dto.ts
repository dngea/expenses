import { IsDateString, IsOptional, Matches } from 'class-validator';

export class ListExpensesQueryDto {
  @Matches(/^\d{4}-\d{2}$/, {
    message: 'Not a valid format, month must be yyyy-mm',
  })
  @IsOptional()
  month?: string;
}
