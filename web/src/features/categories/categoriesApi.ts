import { apiFetch } from "../../shared/api/client";
import type {
  Category,
  MovementType,
  NewCategory,
} from "../../shared/api/types";

/** `type` is required by the backend (?type=expense|income). */
export function getCategories(type: MovementType): Promise<Category[]> {
  return apiFetch<Category[]>("/categories", { query: { type } });
}

/** `color` and `icon` are keys ("blue", "shopping-cart"); see categoryColors.ts and categoryIcons.ts in this folder. */
/** The type is fixed at creation; the backend doesn't let you change it later. */
export function createCategory(
  type: MovementType,
  category: NewCategory,
): Promise<Category> {
  return apiFetch<Category>("/categories", {
    method: "POST",
    body: { ...category, type },
  });
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
 * Deletes a category. Without `force` the backend answers 409 if it still has movements;
 * with `force: true` (?force=true) it deletes those movements too.
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
