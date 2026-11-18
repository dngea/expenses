import { apiFetch } from './client';
import type { Category, NewCategory } from './types';

export function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>('/categories');
}

/** `color` and `icon` are keys ("blue", "shopping-cart"); see src/lib/categoryColors.ts and categoryIcons.ts. */
export function createCategory(category: NewCategory): Promise<Category> {
  return apiFetch<Category>('/categories', { method: 'POST', body: category });
}
