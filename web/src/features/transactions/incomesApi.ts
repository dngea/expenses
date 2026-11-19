/**
 * TEMPORARY MOCK — there is no incomes endpoint yet.
 * Same shape as `expensesApi.ts` / `categoriesApi.ts`, so once the backend exists, replace each
 * function body with the matching `apiFetch` call (e.g. `apiFetch('/incomes/summary', …)`)
 * and delete the in-memory data below.
 */
import { addMonths, todayString } from '../../shared/lib/dates';
import { sumDecimals } from '../../shared/lib/format';
import type { Category, CategoryTotal, DecimalString, NewExpense } from '../../shared/api/types';
import type { ExpenseFilter } from './expensesApi';

export type NewIncome = NewExpense;
export type IncomeFilter = ExpenseFilter;

const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Salary', color: 'blue', icon: 'briefcase' },
  { id: 2, name: 'Freelance', color: 'violet', icon: 'laptop' },
  { id: 3, name: 'Investments', color: 'green', icon: 'trending-up' },
  { id: 4, name: 'Other', color: 'magenta', icon: 'wallet' },
];

interface MockIncome {
  amount: DecimalString;
  category_id: number;
  spent_at: string;
}

const thisMonth = todayString().slice(0, 7);
const lastMonth = addMonths(todayString(), -1).slice(0, 7);

const mockIncomes: MockIncome[] = [
  { amount: '2400.00', category_id: 1, spent_at: `${thisMonth}-01` },
  { amount: '650.00', category_id: 2, spent_at: `${thisMonth}-10` },
  { amount: '84.30', category_id: 3, spent_at: `${thisMonth}-15` },
  { amount: '2400.00', category_id: 1, spent_at: `${lastMonth}-01` },
  { amount: '320.00', category_id: 2, spent_at: `${lastMonth}-18` },
  { amount: '45.00', category_id: 4, spent_at: `${lastMonth}-22` },
];

const delay = <T,>(value: T) => new Promise<T>((resolve) => setTimeout(() => resolve(value), 200));

export function getIncomeCategories(): Promise<Category[]> {
  return delay(MOCK_CATEGORIES);
}

export function getIncomeSummary(filter: IncomeFilter = {}): Promise<CategoryTotal[]> {
  const inRange = (date: string) =>
    (!filter.from || date >= filter.from) && (!filter.to || date <= filter.to);
  const rows = MOCK_CATEGORIES.map((c) => {
    const amounts = mockIncomes
      .filter((i) => i.category_id === c.id && inRange(i.spent_at))
      .map((i) => i.amount);
    return amounts.length > 0 ? [{ category_id: c.id, category_name: c.name, total: sumDecimals(amounts) }] : [];
  });
  return delay(rows.flat());
}

export function createIncome(income: NewIncome): Promise<void> {
  mockIncomes.push({
    amount: income.amount.toFixed(2),
    category_id: income.category_id,
    spent_at: income.spent_at,
  });
  return delay(undefined);
}
