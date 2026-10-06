// Summary numbers for the list header and the status tabs. They are always
// computed over every todo, not just the ones the current filter shows.

import type { Todo } from "./types";

export interface TodoSummary {
  total: number;
  active: number;
  completed: number;
}

/** Count all todos, the open ones, and the finished ones. */
export function summarize(todos: Todo[]): TodoSummary {
  const completed = todos.filter((todo) => todo.completed).length;
  return { total: todos.length, active: todos.length - completed, completed };
}
