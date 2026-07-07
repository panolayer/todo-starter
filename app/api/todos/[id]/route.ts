import { NextResponse } from "next/server";
import { updateTodo, deleteTodo } from "@/lib/todos";
import type { UpdateTodoInput } from "@/lib/types";

// PATCH /api/todos/:id — toggle completion and/or rename a todo.
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const patch: UpdateTodoInput = {};
  if (typeof body.title === "string") patch.title = body.title;
  if (typeof body.completed === "boolean") patch.completed = body.completed;

  const todo = await updateTodo(params.id, patch);
  if (!todo) return NextResponse.json({ error: "todo not found" }, { status: 404 });
  return NextResponse.json({ todo });
}

// DELETE /api/todos/:id — remove a todo.
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const ok = await deleteTodo(params.id);
  if (!ok) return NextResponse.json({ error: "todo not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
