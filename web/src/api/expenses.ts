import { apiFetch } from './client';
import type { CategoryTotal, Expense, MonthString, NewExpense } from './types';

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
