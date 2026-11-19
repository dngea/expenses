import { apiFetch } from '../../shared/api/client';
import type { CategoryTotal, Expense, MonthString, NewExpense } from '../../shared/api/types';

export interface ExpenseFilter {
  month?: MonthString;
}

export function getExpenses(filter: ExpenseFilter = {}): Promise<Expense[]> {
  return apiFetch<Expense[]>('/expenses', { query: { month: filter.month } });
}

export function getExpenseSummary(filter: ExpenseFilter = {}): Promise<CategoryTotal[]> {
  return apiFetch<CategoryTotal[]>('/expenses/summary', { query: { month: filter.month } });
}

export function createExpense(expense: NewExpense): Promise<Expense> {
  return apiFetch<Expense>('/expenses', { method: 'POST', body: expense });
}

/**
 * How many expenses a category has (all months). The backend has no category filter yet,
 * so this loads all expenses and counts here; replace with a backend count when available.
 */
export async function countExpensesInCategory(categoryId: number): Promise<number> {
  const expenses = await apiFetch<Expense[]>('/expenses');
  return expenses.filter((e) => e.category_id === categoryId).length;
}
