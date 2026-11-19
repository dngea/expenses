/**
 * TEMPORARY MOCK — there is no incomes endpoint yet.
 * Same shape as `expensesApi.ts` / `categoriesApi.ts`, so once the backend exists, replace each
 * function body with the matching `apiFetch` call (e.g. `apiFetch('/incomes/summary', …)`)
 * and delete the in-memory data below.
 */
import { addMonths, todayString } from '../../shared/lib/dates';
import { sumDecimals } from '../../shared/lib/format';
import type { Category, CategoryTotal, DecimalString, Expense, NewExpense } from '../../shared/api/types';
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
  id: number;
  amount: DecimalString;
  category_id: number;
  spent_at: string;
  description: string | null;
}

const thisMonth = todayString().slice(0, 7);
const lastMonth = addMonths(todayString(), -1).slice(0, 7);

let mockIncomes: MockIncome[] = [
  { id: 1, amount: '2400.00', category_id: 1, spent_at: `${thisMonth}-01`, description: 'Monthly salary' },
  { id: 2, amount: '650.00', category_id: 2, spent_at: `${thisMonth}-10`, description: 'Website project' },
  { id: 3, amount: '84.30', category_id: 3, spent_at: `${thisMonth}-15`, description: null },
  { id: 4, amount: '2400.00', category_id: 1, spent_at: `${lastMonth}-01`, description: 'Monthly salary' },
  { id: 5, amount: '320.00', category_id: 2, spent_at: `${lastMonth}-18`, description: null },
  { id: 6, amount: '45.00', category_id: 4, spent_at: `${lastMonth}-22`, description: 'Sold old bike' },
];
let nextId = 7;

const delay = <T,>(value: T) => new Promise<T>((resolve) => setTimeout(() => resolve(value), 200));

export function getIncomeCategories(): Promise<Category[]> {
  return delay(MOCK_CATEGORIES);
}

export function getIncomeSummary(filter: IncomeFilter = {}): Promise<CategoryTotal[]> {
  const rows = MOCK_CATEGORIES.map((c) => {
    const amounts = mockIncomes
      .filter((i) => i.category_id === c.id && inRange(filter, i.spent_at))
      .map((i) => i.amount);
    return amounts.length > 0 ? [{ category_id: c.id, category_name: c.name, total: sumDecimals(amounts) }] : [];
  });
  return delay(rows.flat());
}

const inRange = (filter: IncomeFilter, date: string) =>
  (!filter.from || date >= filter.from) && (!filter.to || date <= filter.to);

/** Same shape and order as GET /expenses: newest first. */
export function getIncomes(filter: IncomeFilter = {}): Promise<Expense[]> {
  const rows = mockIncomes
    .filter((i) => inRange(filter, i.spent_at))
    .sort((a, b) => b.spent_at.localeCompare(a.spent_at) || b.id - a.id)
    .map((i) => ({
      ...i,
      category_name: MOCK_CATEGORIES.find((c) => c.id === i.category_id)?.name ?? '',
    }));
  return delay(rows);
}

const toMock = (id: number, income: NewIncome): MockIncome => ({
  id,
  amount: income.amount.toFixed(2),
  category_id: income.category_id,
  spent_at: income.spent_at,
  description: income.description ?? null,
});

export function createIncome(income: NewIncome): Promise<void> {
  mockIncomes.push(toMock(nextId++, income));
  return delay(undefined);
}

export function updateIncome(id: number, income: NewIncome): Promise<void> {
  mockIncomes = mockIncomes.map((i) => (i.id === id ? toMock(id, income) : i));
  return delay(undefined);
}

export function deleteIncome(id: number): Promise<void> {
  mockIncomes = mockIncomes.filter((i) => i.id !== id);
  return delay(undefined);
}
