import { IsDateString, IsOptional, Matches } from 'class-validator';

export class ListExpensesQueryDto {
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Not a valid format, month must be yyyy-mm-dd',
  })
  @IsDateString({ strict: true })
  @IsOptional()
  from?: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Not a valid format, month must be yyyy-mm-dd',
  })
  @IsDateString({ strict: true })
  @IsOptional()
  to?: string;
}
