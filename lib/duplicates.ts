// Spotting todos that were added more than once. The list endpoint reports
// these so the page can point them out.

import type { Todo } from "./types";

/** Titles (trimmed, lowercased) that appear on more than one todo, each listed once. */
export function duplicateTitles(todos: Todo[]): string[] {
  const seen: string[] = [];
  const repeated: string[] = [];
  for (const todo of todos) {
    const key = todo.title.trim().toLowerCase();
    if (seen.includes(key) && !repeated.includes(key)) repeated.push(key);
    seen.push(key);
  }
  return repeated;
}
