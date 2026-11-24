import { apiFetch } from "../../shared/api/client";
import type {
  CategoryTotal,
  DateString,
  DecimalString,
  Movement,
  MovementType,
  NewMovement,
} from "../../shared/api/types";

/** Date range, both ends inclusive ("YYYY-MM-DD"). Omit both to get everything. */
export interface MovementFilter {
  from?: DateString;
  to?: DateString;
}

/** Newest first. `type` is required by the backend (?type=expense|income). */
export function getMovements(
  type: MovementType,
  filter: MovementFilter = {},
): Promise<Movement[]> {
  return apiFetch<Movement[]>("/movements", {
    query: { type, from: filter.from, to: filter.to },
  });
}

export function getMovementSummary(
  type: MovementType,
  filter: MovementFilter = {},
): Promise<CategoryTotal[]> {
  return apiFetch<CategoryTotal[]>("/movements/summary", {
    query: { type, from: filter.from, to: filter.to },
  });
}

/** The type comes from the category, so the body doesn't carry it. */
export function createMovement(movement: NewMovement): Promise<Movement> {
  return apiFetch<Movement>("/movements", { method: "POST", body: movement });
}

/**
 * How many movements a category has (all periods). The backend has no category filter yet,
 * so this loads all movements of the category's type and counts here; replace with a
 * backend count when available.
 */
export async function countMovementsInCategory(
  type: MovementType,
  categoryId: number,
): Promise<number> {
  const movements = await getMovements(type);
  return movements.filter((m) => m.category_id === categoryId).length;
}

/** PATCH: the backend's UpdateMovementDto accepts any subset; we send the whole entry. */
export function updateMovement(
  id: number,
  movement: NewMovement,
): Promise<Movement> {
  return apiFetch<Movement>(`/movements/${id}`, {
    method: "PATCH",
    body: movement,
  });
}

export function deleteMovement(id: number): Promise<void> {
  return apiFetch<void>(`/movements/${id}`, { method: "DELETE" });
}

/** Total incomes minus total expenses, over all time. Can be negative. */
export function getBalance(): Promise<{ balance: DecimalString }> {
  return apiFetch<{ balance: DecimalString }>("/movements/balance");
}
