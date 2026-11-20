import { apiFetch } from "../../shared/api/client";
import type { Category, NewCategory } from "../../shared/api/types";

export function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>("/categories");
}

/** `color` and `icon` are keys ("blue", "shopping-cart"); see categoryColors.ts and categoryIcons.ts in this folder. */
export function createCategory(category: NewCategory): Promise<Category> {
  return apiFetch<Category>("/categories", { method: "POST", body: category });
}

/** Sends all fields (the backend's UpdateCategoryDto requires them). */
export function updateCategory(
  id: number,
  category: NewCategory,
): Promise<Category> {
  return apiFetch<Category>(`/categories/${id}`, {
    method: "PATCH",
    body: category,
  });
}

/**
 * Deletes a category. Without `force` the backend answers 409 if it still has expenses;
 * with `force: true` (?force=true) it deletes those expenses too.
 */
export function deleteCategory(
  id: number,
  options: { force?: boolean } = {},
): Promise<void> {
  return apiFetch<void>(`/categories/${id}`, {
    method: "DELETE",
    query: { force: options.force ? "true" : undefined },
  });
}
