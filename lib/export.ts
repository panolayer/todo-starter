// The JSON download behind the page's Export link (GET /api/todos/export).

import type { Todo } from "./types";

/** The todos to export: the first `limit` of them, or every todo when the request has no `limit` query parameter. */
export function firstTodos(todos: Todo[], params: URLSearchParams): Todo[] {
  const limit = Number(params.get("limit"));
  const shown = todos.slice(0, limit);
  return shown;
}
