import { getCategories } from '../categories/categoriesApi';
import {
  createMovement,
  deleteMovement,
  getMovements,
  getMovementSummary,
  updateMovement,
  type MovementFilter,
} from './movementsApi';
import type {
  Category,
  CategoryTotal,
  Movement,
  MovementType,
  NewMovement,
} from '../../shared/api/types';

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
  /** Value of `?type=` for this ledger's categories and movements. */
  type: MovementType;
  getCategories: () => Promise<Category[]>;
  getSummary: (filter: MovementFilter) => Promise<CategoryTotal[]>;
  getEntries: (filter: MovementFilter) => Promise<Movement[]>;
  create: (entry: NewMovement) => Promise<unknown>;
  update: (id: number, entry: NewMovement) => Promise<unknown>;
  remove: (id: number) => Promise<unknown>;
}

/** The API calls of one ledger, all bound to the same `?type=`. */
function movementApi(type: MovementType) {
  return {
    type,
    getCategories: () => getCategories(type),
    getSummary: (filter: MovementFilter) => getMovementSummary(type, filter),
    getEntries: (filter: MovementFilter) => getMovements(type, filter),
    create: createMovement,
    update: updateMovement,
    remove: deleteMovement,
  } satisfies Partial<ModeConfig>;
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
    ...movementApi('expense'),
  },
  incomes: {
    label: 'Income',
    newTitle: 'New income',
    editTitle: 'Edit income',
    noun: 'income',
    addLabel: 'Add income',
    saveLabel: 'Save income',
    emptyText: 'No income in this period.',
    noCategoriesText: 'No income categories yet. Create one in the menu first.',
    ...movementApi('income'),
  },
};

export const MODE_ORDER: Mode[] = ['expenses', 'incomes'];

export function parseMode(value: string | null): Mode {
  return value === 'incomes' ? 'incomes' : 'expenses';
}
