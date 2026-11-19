import { getCategories } from '../categories/categoriesApi';
import { createExpense, getExpenseSummary, type ExpenseFilter } from './expensesApi';
import { createIncome, getIncomeCategories, getIncomeSummary } from './incomesApi';
import type { Category, CategoryTotal, NewExpense } from '../../shared/api/types';

/** Which ledger the home screen shows. Each mode has its own accent color (see `index.css`). */
export type Mode = 'expenses' | 'incomes';

export interface ModeConfig {
  label: string;
  newTitle: string;
  addLabel: string;
  saveLabel: string;
  emptyText: string;
  noCategoriesText: string;
  getCategories: () => Promise<Category[]>;
  getSummary: (filter: ExpenseFilter) => Promise<CategoryTotal[]>;
  create: (entry: NewExpense) => Promise<unknown>;
}

export const MODES: Record<Mode, ModeConfig> = {
  expenses: {
    label: 'Expenses',
    newTitle: 'New expense',
    addLabel: 'Add expense',
    saveLabel: 'Save expense',
    emptyText: 'No expenses in this period.',
    noCategoriesText: 'No categories yet. Create one in the menu first.',
    getCategories,
    getSummary: getExpenseSummary,
    create: createExpense,
  },
  incomes: {
    label: 'Income',
    newTitle: 'New income',
    addLabel: 'Add income',
    saveLabel: 'Save income',
    emptyText: 'No income in this period.',
    noCategoriesText: 'No income categories yet.',
    getCategories: getIncomeCategories,
    getSummary: getIncomeSummary,
    create: createIncome,
  },
};

export const MODE_ORDER: Mode[] = ['expenses', 'incomes'];

export function parseMode(value: string | null): Mode {
  return value === 'incomes' ? 'incomes' : 'expenses';
}
