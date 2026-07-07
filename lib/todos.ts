// Data-access layer for todos. The API routes call these functions; they never
// touch the store (lib/db) directly. This keeps a clean boundary between "how
// requests come in" (app/api) and "how data is stored" (lib/db).

import { randomUUID } from "crypto";
import { readAll, writeAll } from "./db";
import type { Todo, UpdateTodoInput } from "./types";

/** List todos, newest first. */
export async function listTodos(): Promise<Todo[]> {
  const todos = await readAll();
  return [...todos].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

/** Create a todo with the given title. */
export async function createTodo(title: string): Promise<Todo> {
  const todos = await readAll();
  const todo: Todo = {
    id: randomUUID(),
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  todos.push(todo);
  await writeAll(todos);
  return todo;
}

/** Apply a partial update to a todo. Returns null if the id is unknown. */
export async function updateTodo(id: string, patch: UpdateTodoInput): Promise<Todo | null> {
  const todos = await readAll();
  const idx = todos.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  todos[idx] = { ...todos[idx], ...patch };
  await writeAll(todos);
  return todos[idx];
}

/** Delete a todo. Returns false if the id is unknown. */
export async function deleteTodo(id: string): Promise<boolean> {
  const todos = await readAll();
  const next = todos.filter((t) => t.id !== id);
  if (next.length === todos.length) return false;
  await writeAll(next);
  return true;
}
