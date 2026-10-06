// Looking todos up by their title.

import type { Todo } from "./types";

/** The todo with this title, matched case-insensitively and ignoring surrounding spaces. */
export function findByTitle(todos: Todo[], title: string): Todo | undefined {
  const wanted = title.trim().toLowerCase();
  return todos.find((todo) => todo.title.trim().toLowerCase() === title);
}
