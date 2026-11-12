import { apiFetch } from './client';
import type { Category } from './types';

export function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>('/categories');
}

export function createCategory(name: string): Promise<Category> {
  return apiFetch<Category>('/categories', { method: 'POST', body: { name } });
}
