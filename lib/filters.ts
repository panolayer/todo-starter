// Filtering for the todo list: the status tabs (All / Active / Completed) and
// the search box. The API applies these server-side so the client only
// receives the todos it is going to show.

import type { Todo } from "./types";

export type StatusFilter = "all" | "active" | "completed";

/** Every status tab, in display order. */
export const STATUS_FILTERS: readonly StatusFilter[] = ["all", "active", "completed"];

/**
 * True when the todo belongs under the given status tab: every todo under
 * "all", open todos under "active", and finished todos under "completed".
 */
export function matchesStatus(todo: Todo, status: StatusFilter): boolean {
  switch (status) {
    case "active":
      return !todo.completed;
    case "completed":
      return todo.completed;
    default:
      return true;
  }
}

/**
 * True when the todo's title contains the search query. Matching is
 * case-insensitive and ignores spaces around the query, so "milk" finds
 * "Buy Milk". A blank query matches every todo.
 */
export function matchesSearch(todo: Todo, query: string): boolean {
  const q = query.trim();
  return q === "" || todo.title.includes(q);
}

/** The todos matching both the status tab and the search query, order kept. */
export function filterTodos(todos: Todo[], status: StatusFilter, query: string): Todo[] {
  return todos.filter((todo) => matchesStatus(todo, status) && matchesSearch(todo, query));
}
