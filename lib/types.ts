// Domain types for the todo app. Kept in one place so the frontend, the API
// routes, and the data layer all speak the same shapes.

export type Priority = "low" | "medium" | "high";

/** Every priority, lowest first. */
export const PRIORITIES: readonly Priority[] = ["low", "medium", "high"];

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  /** Calendar day the todo is due, as YYYY-MM-DD, or null when it has none. */
  dueDate: string | null;
  /** ISO-8601 timestamp of when the todo was created. */
  createdAt: string;
}

/** Fields accepted when creating a todo. */
export interface CreateTodoInput {
  title: string;
  priority?: Priority;
  dueDate?: string | null;
}

/** Fields accepted when updating a todo (all optional). */
export interface UpdateTodoInput {
  title?: string;
  completed?: boolean;
  priority?: Priority;
  dueDate?: string | null;
}

/** True when `value` is one of the known priorities. */
export function isPriority(value: unknown): value is Priority {
  return typeof value === "string" && (PRIORITIES as readonly string[]).includes(value);
}
