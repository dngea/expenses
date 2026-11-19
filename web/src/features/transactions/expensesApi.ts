import { apiFetch } from '../../shared/api/client';
import type { CategoryTotal, DateString, Expense, NewExpense } from '../../shared/api/types';

/** Date range, both ends inclusive ("YYYY-MM-DD"). Omit both to get everything. */
export interface ExpenseFilter {
  from?: DateString;
  to?: DateString;
}

export function getExpenses(filter: ExpenseFilter = {}): Promise<Expense[]> {
  return apiFetch<Expense[]>('/expenses', { query: { from: filter.from, to: filter.to } });
}

export function getExpenseSummary(filter: ExpenseFilter = {}): Promise<CategoryTotal[]> {
  return apiFetch<CategoryTotal[]>('/expenses/summary', {
    query: { from: filter.from, to: filter.to },
  });
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

/** PATCH: the backend's UpdateExpenseDto accepts any subset; we send the whole entry. */
export function updateExpense(id: number, expense: NewExpense): Promise<Expense> {
  return apiFetch<Expense>(`/expenses/${id}`, { method: 'PATCH', body: expense });
}

export function deleteExpense(id: number): Promise<void> {
  return apiFetch<void>(`/expenses/${id}`, { method: 'DELETE' });
}
