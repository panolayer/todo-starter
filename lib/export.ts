// The JSON download behind the page's Export link (GET /api/todos/export).

import type { Todo } from "./types";

/** The first `limit` todos for the export endpoint's optional `limit` query parameter (all of them when it is absent). */
export function firstTodos(todos: Todo[], params: URLSearchParams): Todo[] {
  const limit = Number(params.get("limit"));
  const shown = todos.slice(0, limit);
  return shown;
}
