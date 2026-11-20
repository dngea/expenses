import { IsIn } from 'class-validator';

export class ListCategoriesDto {
  @IsIn(['income', 'expense'])
  type: 'income' | 'expense';
}
