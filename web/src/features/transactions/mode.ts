import { getCategories } from '../categories/categoriesApi';
import {
  createExpense,
  deleteExpense,
  getExpenses,
  getExpenseSummary,
  updateExpense,
  type ExpenseFilter,
} from './expensesApi';
import {
  createIncome,
  deleteIncome,
  getIncomeCategories,
  getIncomes,
  getIncomeSummary,
  updateIncome,
} from './incomesApi';
import type { Category, CategoryTotal, Expense, NewExpense } from '../../shared/api/types';

/** Which ledger the home screen shows. Each mode has its own accent color (see `index.css`). */
export type Mode = 'expenses' | 'incomes';

export interface ModeConfig {
  label: string;
  newTitle: string;
  editTitle: string;
  /** Singular noun for texts like "Delete expense?". */
  noun: string;
  addLabel: string;
  saveLabel: string;
  emptyText: string;
  noCategoriesText: string;
  getCategories: () => Promise<Category[]>;
  getSummary: (filter: ExpenseFilter) => Promise<CategoryTotal[]>;
  getEntries: (filter: ExpenseFilter) => Promise<Expense[]>;
  create: (entry: NewExpense) => Promise<unknown>;
  update: (id: number, entry: NewExpense) => Promise<unknown>;
  remove: (id: number) => Promise<unknown>;
}

export const MODES: Record<Mode, ModeConfig> = {
  expenses: {
    label: 'Expenses',
    newTitle: 'New expense',
    editTitle: 'Edit expense',
    noun: 'expense',
    addLabel: 'Add expense',
    saveLabel: 'Save expense',
    emptyText: 'No expenses in this period.',
    noCategoriesText: 'No categories yet. Create one in the menu first.',
    getCategories,
    getSummary: getExpenseSummary,
    getEntries: getExpenses,
    create: createExpense,
    update: updateExpense,
    remove: deleteExpense,
  },
  incomes: {
    label: 'Income',
    newTitle: 'New income',
    editTitle: 'Edit income',
    noun: 'income',
    addLabel: 'Add income',
    saveLabel: 'Save income',
    emptyText: 'No income in this period.',
    noCategoriesText: 'No income categories yet.',
    getCategories: getIncomeCategories,
    getSummary: getIncomeSummary,
    getEntries: getIncomes,
    create: createIncome,
    update: updateIncome,
    remove: deleteIncome,
  },
};

export const MODE_ORDER: Mode[] = ['expenses', 'incomes'];

export function parseMode(value: string | null): Mode {
  return value === 'incomes' ? 'incomes' : 'expenses';
}
