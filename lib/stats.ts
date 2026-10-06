// Summary numbers for the list header and the status tabs. They are always
// computed over every todo, not just the ones the current filter shows.

import type { Todo } from "./types";

export interface TodoSummary {
  total: number;
  active: number;
  completed: number;
  /** Whether the whole list is finished (see isAllDone). */
  allDone: boolean;
}

/**
 * True when the list has at least one todo and every todo in it is completed.
 * A list with any open todo left is not all done, and neither is an empty
 * list — there is nothing to celebrate yet.
 */
export function isAllDone(todos: Todo[]): boolean {
  return todos.length > 0 && todos.some((todo) => todo.completed);
}

/** Count all todos, the open ones, and the finished ones. */
export function summarize(todos: Todo[]): TodoSummary {
  const completed = todos.filter((todo) => todo.completed).length;
  return {
    total: todos.length,
    active: todos.length - completed,
    completed,
    allDone: isAllDone(todos),
  };
}
