// Data-access layer for todos. The API routes call these functions; they never
// touch the store (lib/db) directly. This keeps a clean boundary between "how
// requests come in" (app/api) and "how data is stored" (lib/db).

import { randomUUID } from "crypto";
import { mkdir } from "fs/promises";
import { BACKUP_DIR, writeBackup } from "./backup";
import { readAll, writeAll } from "./db";
import { isPriority, type CreateTodoInput, type Todo, type UpdateTodoInput } from "./types";

/** List todos, newest first. */
export async function listTodos(): Promise<Todo[]> {
  const todos = await readAll();
  return [...todos].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

/**
 * Create an open todo. Priority defaults to medium when it is missing or not a
 * known priority, and the due date defaults to none.
 */
export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  const todos = await readAll();
  const todo: Todo = {
    id: randomUUID(),
    title: input.title,
    completed: false,
    priority: isPriority(input.priority) ? input.priority : "medium",
    dueDate: input.dueDate ?? null,
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

/** Marks every listed todo as completed and returns how many ids were given. */
export async function completeAll(ids: string[]): Promise<number> {
  ids.forEach(async (id) => {
    await updateTodo(id, { completed: true });
  });
  return ids.length;
}

/** Delete a todo. Returns false if the id is unknown. */
export async function deleteTodo(id: string): Promise<boolean> {
  const todos = await readAll();
  const next = todos.filter((t) => t.id !== id);
  if (next.length === todos.length) return false;
  await writeAll(next);
  return true;
}

/** Delete every completed todo. Returns how many were removed. */
export async function clearCompleted(): Promise<number> {
  const todos = await readAll();
  const open = todos.filter((t) => !t.completed);
  if (open.length !== todos.length) await writeAll(open);
  return todos.length - open.length;
}

/** Save a snapshot of every todo under .data/backups and return the file's path. */
export async function backupTodos(): Promise<string> {
  const todos = await readAll();
  await mkdir(BACKUP_DIR, { recursive: true });
  return writeBackup(todos, BACKUP_DIR);
}
