/** Decimal values (PostgreSQL NUMERIC) arrive as strings, e.g. "12.50". Never do float math on them. */
export type DecimalString = string;

/** Plain calendar date "YYYY-MM-DD" (no time zone). */
export type DateString = string;

/** Month "YYYY-MM". */
export type MonthString = string;

export interface Category {
  id: number;
  name: string;
}

export interface Expense {
  id: number;
  amount: DecimalString;
  category_id: number;
  category_name: string;
  spent_at: DateString;
  description: string | null;
}

export interface CategoryTotal {
  category_id: number;
  category_name: string;
  total: DecimalString;
}

export interface NewExpense {
  amount: number;
  category_id: number;
  spent_at: DateString;
  description?: string;
}
